import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    this.registerForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {}

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      try {
        this.isLoading = true;
        const { confirmPassword, ...userData } = this.registerForm.value;
        
        await this.authService.register(userData);
        
        // Mostrar mensaje de éxito
        const toast = await this.toastCtrl.create({
          message: '¡Te has registrado correctamente!',
          duration: 3000,
          position: 'top',
          color: 'success',
          buttons: [
            {
              text: 'OK',
              role: 'cancel'
            }
          ]
        });
        await toast.present();

        // Esperar un momento para que el usuario vea el mensaje antes de redirigir
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);

      } catch (error: any) {
        console.error('Error al registrar:', error);
        this.errorMessage = error.message || 'Error al registrar usuario';
        
        // Mostrar mensaje de error
        const toast = await this.toastCtrl.create({
          message: this.errorMessage,
          duration: 3000,
          position: 'top',
          color: 'danger',
          buttons: [
            {
              text: 'OK',
              role: 'cancel'
            }
          ]
        });
        await toast.present();
      } finally {
        this.isLoading = false;
      }
    } else {
      this.errorMessage = 'Por favor, complete todos los campos correctamente';
      
      // Mostrar mensaje de error de validación
      const toast = await this.toastCtrl.create({
        message: this.errorMessage,
        duration: 3000,
        position: 'top',
        color: 'warning',
        buttons: [
          {
            text: 'OK',
            role: 'cancel'
          }
        ]
      });
      await toast.present();
    }
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
} 