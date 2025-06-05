import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, throwError, of } from 'rxjs';
import { map, tap, catchError, switchMap, take, filter } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido?: string;
  role: 'cliente' | 'secretaria' | 'chofer' | 'gerencia';
  createdAt?: Date;
  lastLogin?: Date;
  uid: string;
}

export type UserResponse = User;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private authStateInitialized = false;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    console.log('AuthService constructor - Iniciando observación del estado de autenticación');
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      // Establecer persistencia NONE para evitar inicio de sesión automático
      await this.afAuth.setPersistence('none');
      
      // Inicializar observación del estado de autenticación
      this.afAuth.authState.subscribe(async (firebaseUser) => {
        console.log('AuthState cambió:', firebaseUser?.email);
        
        if (firebaseUser) {
          try {
            const userDoc = await this.afs.doc(`users/${firebaseUser.uid}`).get().toPromise();
            if (userDoc?.exists) {
              const userData = userDoc.data() as Omit<User, 'id'>;
              const user: User = {
                ...userData,
                id: firebaseUser.uid
              };
              console.log('Usuario encontrado en Firestore:', user.email);
              this.currentUserSubject.next(user);
            } else {
              console.log('Usuario no encontrado en Firestore');
              this.currentUserSubject.next(null);
              await this.afAuth.signOut();
            }
          } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            this.currentUserSubject.next(null);
            await this.afAuth.signOut();
          }
        } else {
          console.log('No hay usuario autenticado');
          this.currentUserSubject.next(null);
        }
        
        this.authStateInitialized = true;
      });
    } catch (error) {
      console.error('Error al inicializar autenticación:', error);
      this.authStateInitialized = true;
      this.currentUserSubject.next(null);
    }
  }

  getCurrentUser(): Observable<User | null> {
    if (!this.authStateInitialized) {
      console.log('Esperando inicialización del estado de autenticación...');
      return this.currentUser$.pipe(
        filter(() => this.authStateInitialized),
        take(1)
      );
    }
    return this.currentUser$;
  }

  isAuthenticated(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map(user => !!user)
    );
  }

  login(email: string, password: string): Observable<User> {
    console.log('Iniciando login para:', email);
    
    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
      switchMap(async (userCredential) => {
        const uid = userCredential.user?.uid;
        if (!uid) throw new Error('No se pudo obtener el ID del usuario');

        const userDoc = await this.afs.doc(`users/${uid}`).get().toPromise();
        
        if (!userDoc?.exists) {
          throw new Error('Usuario no encontrado en la base de datos');
        }

        const userData = userDoc.data() as Omit<User, 'id'>;
        const user: User = {
          ...userData,
          id: uid
        };

        // Actualizar lastLogin
        await this.afs.doc(`users/${uid}`).update({
          lastLogin: new Date()
        });

        console.log('Login exitoso para:', user.email);
        this.currentUserSubject.next(user);
        return user;
      }),
      catchError(error => {
        console.error('Error en login:', error);
        let message = 'Error al iniciar sesión. Verifica tus credenciales.';
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          message = 'Usuario o contraseña incorrectos';
        }
        return throwError(() => new Error(message));
      })
    );
  }

  async logout(): Promise<void> {
    try {
      console.log('Cerrando sesión...');
      await this.afAuth.signOut();
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  async register(userData: { email: string; password: string; nombre: string }): Promise<UserResponse> {
    try {
      console.log('Iniciando registro con datos:', { email: userData.email, nombre: userData.nombre });

      // Crear usuario en Firebase Auth
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(
        userData.email,
        userData.password
      );

      console.log('Usuario creado en Firebase Auth');

      if (!userCredential.user) {
        throw new Error('No se pudo crear el usuario en Firebase Auth');
      }

      // Crear nuevo usuario en Firestore
      const newUser: User = {
        id: userCredential.user.uid,
        email: userData.email,
        nombre: userData.nombre,
        role: 'cliente',
        createdAt: new Date(),
        lastLogin: new Date(),
        uid: userCredential.user.uid
      };

      console.log('Intentando guardar usuario en Firestore:', newUser);

      // Guardar en Firestore (omitiendo el id del documento)
      const { id, ...userDataForFirestore } = newUser;
      await this.afs.doc(`users/${id}`).set(userDataForFirestore);
      
      console.log('Usuario guardado exitosamente en Firestore');

      return newUser;
    } catch (error: any) {
      console.error('Error detallado en registro:', error);
      let message = 'Error al registrar usuario';
      
      if (error.code === 'auth/email-already-in-use') {
        message = 'El correo electrónico ya está registrado';
      } else if (error.code === 'auth/invalid-email') {
        message = 'El correo electrónico no es válido';
      } else if (error.code === 'auth/operation-not-allowed') {
        message = 'El registro de usuarios está deshabilitado';
      } else if (error.code === 'auth/weak-password') {
        message = 'La contraseña es demasiado débil';
      }
      
      throw new Error(message);
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const userDoc = await this.afs.doc(`users/${userId}`).get().toPromise();
      if (userDoc?.exists) {
        const userData = userDoc.data() as Omit<User, 'id'>;
        return {
          ...userData,
          id: userId
        };
      }
      return null;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  }

  async getCurrentUserId(): Promise<string | null> {
    const user = await this.afAuth.currentUser;
    return user ? user.uid : null;
  }
} 