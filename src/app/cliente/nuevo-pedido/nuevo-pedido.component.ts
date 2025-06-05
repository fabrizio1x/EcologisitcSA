import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-nuevo-pedido',
  templateUrl: './nuevo-pedido.component.html',
  styleUrls: ['./nuevo-pedido.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class NuevoPedidoComponent implements OnInit {
  pedidoForm: FormGroup;
  regiones = ['Metropolitana', 'Valparaíso', 'Biobío']; // Ejemplo de regiones
  comunasPorRegion: { [key: string]: string[] } = {
    'Metropolitana': ['Santiago', 'Providencia', 'Las Condes'],
    'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Concón'],
    'Biobío': ['Concepción', 'Talcahuano', 'Chiguayante']
  };
  tamanosPaquete = ['XS', 'S', 'M', 'L'];

  constructor(
    private fb: FormBuilder,
    private pedidoService: PedidoService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.pedidoForm = this.fb.group({
      origen: this.fb.group({
        direccion: ['', Validators.required],
        comuna: ['', Validators.required],
        region: ['', Validators.required],
        referencias: ['']
      }),
      destino: this.fb.group({
        direccion: ['', Validators.required],
        comuna: ['', Validators.required],
        region: ['', Validators.required],
        referencias: ['']
      }),
      tamanoPaquete: ['', Validators.required],
      peso: ['', [Validators.required, Validators.min(0)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      fragil: [false],
      requiereEmbalaje: [false]
    });
  }

  ngOnInit() {
    // Inicialización adicional si es necesaria
  }

  async onSubmit() {
    if (this.pedidoForm.valid) {
      const loading = await this.loadingCtrl.create({
        message: 'Creando pedido...'
      });
      await loading.present();

      try {
        const formValue = this.pedidoForm.value;
        const pedidoData = {
          origen: {
            direccion: formValue.origen.direccion,
            comuna: formValue.origen.comuna,
            region: formValue.origen.region,
            referencias: formValue.origen.referencias
          },
          destino: {
            direccion: formValue.destino.direccion,
            comuna: formValue.destino.comuna,
            region: formValue.destino.region,
            referencias: formValue.destino.referencias
          },
          tamanoPaquete: formValue.tamanoPaquete,
          peso: formValue.peso,
          descripcion: formValue.descripcion,
          fragil: formValue.fragil,
          requiereEmbalaje: formValue.requiereEmbalaje
        };

        const numeroSeguimiento = await this.pedidoService.crearPedido(pedidoData);
        await loading.dismiss();
        
        const toast = await this.toastCtrl.create({
          message: `Pedido creado exitosamente. Número de seguimiento: ${numeroSeguimiento}`,
          duration: 3000,
          position: 'bottom',
          color: 'success'
        });
        await toast.present();
        
        this.router.navigate(['/cliente']);
      } catch (error) {
        console.error('Error al crear el pedido:', error);
        await loading.dismiss();
        
        const toast = await this.toastCtrl.create({
          message: 'Error al crear el pedido. Por favor intente nuevamente.',
          duration: 3000,
          position: 'bottom',
          color: 'danger'
        });
        await toast.present();
      }
    } else {
      Object.keys(this.pedidoForm.controls).forEach(key => {
        const control = this.pedidoForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  // Método para obtener las comunas según la región seleccionada
  getComunas(region: string): string[] {
    return this.comunasPorRegion[region] || [];
  }

  volver() {
    this.router.navigate(['/cliente']);
  }
}
