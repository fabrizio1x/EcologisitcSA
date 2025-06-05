const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Importar configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC_lWMO7hhgSFjl6IoHleKNAg7jY2lkbnk",
  authDomain: "ecologistic-c6564.firebaseapp.com",
  projectId: "ecologistic-c6564",
  storageBucket: "ecologistic-c6564.firebasestorage.app",
  messagingSenderId: "1037359118008",
  appId: "1:1037359118008:web:7e9eb2f8620fbec418664d",
  measurementId: "G-LTKXN17BXK"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Usuarios iniciales
const initialUsers = [
  {
    email: 'gerente@ecologistic.cl',
    password: 'Gerente123!',
    role: 'gerencia',
    nombre: 'Admin',
    apellido: 'Sistema'
  },
  {
    email: 'secretaria@ecologistic.cl',
    password: 'Secretaria123!',
    role: 'secretaria',
    nombre: 'María',
    apellido: 'González'
  },
  {
    email: 'chofer@ecologistic.cl',
    password: 'Chofer123!',
    role: 'chofer',
    nombre: 'Juan',
    apellido: 'Pérez'
  },
  {
    email: 'cliente@ecologistic.cl',
    password: 'Cliente123!',
    role: 'cliente',
    nombre: 'Pedro',
    apellido: 'Soto'
  }
];

// Función para crear un usuario
async function createUser(userData) {
  try {
    // Crear usuario en Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );

    // Crear documento en Firestore
    const userDoc = {
      email: userData.email,
      role: userData.role,
      nombre: userData.nombre,
      apellido: userData.apellido,
      createdAt: new Date(),
      lastLogin: null
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);
    console.log(`Usuario creado: ${userData.email} (${userData.role})`);
  } catch (error) {
    console.error(`Error al crear usuario ${userData.email}:`, error);
  }
}

// Crear todos los usuarios
async function createAllUsers() {
  for (const userData of initialUsers) {
    await createUser(userData);
  }
  console.log('Proceso completado');
  process.exit(0);
}

createAllUsers(); 