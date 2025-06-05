import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toastCtrl: ToastController) {}

  async showToast(message: string, type: 'success' | 'error' | 'warning' = 'success') {
    const icons = {
      success: 'checkmark-circle',
      error: 'alert-circle',
      warning: 'warning'
    };

    const cssClasses = {
      success: 'custom-toast toast-success',
      error: 'custom-toast toast-error',
      warning: 'custom-toast toast-warning'
    };

    const titles = {
      success: '¡Bienvenido!',
      error: 'Error',
      warning: 'Advertencia'
    };

    const toast = await this.toastCtrl.create({
      header: titles[type],
      message: message,
      icon: icons[type],
      position: 'middle',
      duration: 3000,
      cssClass: cssClasses[type],
      buttons: [
        {
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    await toast.present();
  }
} 