import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CotizacionService, Comuna } from '../services/cotizacion.service';
import { PedidoService } from '../services/pedido.service';
import { AuthService, User } from '../auth/auth.service';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'app-solicitar-despacho',
  templateUrl: './solicitar-despacho.component.html',
  styleUrls: ['./solicitar-despacho.component.scss']
})
export class SolicitarDespachoComponent implements OnInit, OnDestroy {
  despachoForm: FormGroup = this.initializeForm();
  comunasPorRegion: { [key: string]: any[] };
  regiones: string[] = [];
  tamanoPaquetes = [
    { id: 'XS', nombre: 'Extra pequeño', descripcion: 'Documentos, sobres (hasta 0.5 kg)', icono: '📄' },
    { id: 'S', nombre: 'Pequeño', descripcion: 'Libros, cajas pequeñas (hasta 3 kg)', icono: '📦' },
    { id: 'M', nombre: 'Mediano', descripcion: 'Ropa, artículos medianos (hasta 6 kg)', icono: '👕' },
    { id: 'L', nombre: 'Grande', descripcion: 'Equipos, cajas grandes (hasta 20 kg)', icono: '📺' }
  ];
  camposFaltantes: string[] = [];
  currentUser: User | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cotizacionService: CotizacionService,
    private pedidoService: PedidoService,
    private authService: AuthService
  ) {
    this.comunasPorRegion = this.cotizacionService.getComunasPorRegion();
    this.regiones = Object.keys(this.comunasPorRegion);
  }

  private initializeForm(): FormGroup {
    return this.fb.group({
      datosPersonales: this.fb.group({
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]]
      }),
      direccionRetiro: this.fb.group({
        region: ['', Validators.required],
        comuna: ['', Validators.required],
        direccion: ['', Validators.required],
        referencias: ['']
      }),
      direccionEntrega: this.fb.group({
        region: ['', Validators.required],
        comuna: ['', Validators.required],
        direccion: ['', Validators.required],
        referencias: ['']
      }),
      datosPaquete: this.fb.group({
        tamano: ['', Validators.required],
        peso: ['', [Validators.required, Validators.min(0.1), Validators.max(20)]],
        descripcion: ['', [Validators.required, Validators.minLength(10)]],
        fragil: [false],
        requiereEmbalaje: [false]
      })
    });
  }

  ngOnInit(): void {
    // Verificar autenticación y cargar datos del usuario si existe
    this.authService.getCurrentUser().pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      this.currentUser = user;
      
      if (user) {
        // Si hay un usuario autenticado, cargar sus datos
        const datosPersonales = this.despachoForm.get('datosPersonales');
        if (datosPersonales) {
          datosPersonales.patchValue({
            nombre: user.nombre + (user.apellido ? ' ' + user.apellido : ''),
            email: user.email
          });
        }
      }
    });

    // Verificar si hay un pedido temporal guardado
    const pedidoTemp = this.pedidoService.obtenerPedidoTemporal();
    if (pedidoTemp) {
      this.despachoForm.patchValue(pedidoTemp);
      this.pedidoService.limpiarPedidoTemporal();
    }

    // Suscribirse a cambios en región de retiro
    this.despachoForm.get('direccionRetiro.region')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.despachoForm.get('direccionRetiro.comuna')?.setValue('');
      });

    // Suscribirse a cambios en región de entrega
    this.despachoForm.get('direccionEntrega.region')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.despachoForm.get('direccionEntrega.comuna')?.setValue('');
      });

    // Actualizar campos faltantes cuando el formulario cambie
    this.despachoForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.actualizarCamposFaltantes();
      });
  }

  async onSubmit() {
    if (!this.currentUser) {
      // Si no hay usuario autenticado, guardar el formulario temporalmente y redirigir al login
      this.pedidoService.guardarPedidoTemporal(this.despachoForm.value);
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: '/solicitar-despacho' }
      });
      return;
    }

    if (this.despachoForm.valid) {
      try {
        const formData = this.despachoForm.value;
        // Obtener coordenadas de origen y destino
        const origenComuna: Comuna | undefined = this.cotizacionService.getComuna(formData.direccionRetiro.comuna);
        const destinoComuna: Comuna | undefined = this.cotizacionService.getComuna(formData.direccionEntrega.comuna);
        const pedidoData = {
          ...formData,
          userId: this.currentUser.id,
          estado: 'pendiente',
          fechaCreacion: new Date(),
          coordenadasOrigen: origenComuna ? [origenComuna.latitud, origenComuna.longitud] : null,
          coordenadasDestino: destinoComuna ? [destinoComuna.latitud, destinoComuna.longitud] : null
        };
        await this.pedidoService.crearPedido(pedidoData);
        this.router.navigate(['/cliente']);
      } catch (error) {
        console.error('Error al crear el pedido:', error);
      }
    } else {
      this.marcarCamposInvalidos(this.despachoForm);
      this.actualizarCamposFaltantes();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private calcularPrecio(formData: any): number {
    const precios: { [key: string]: number } = {
      'XS': 5000,
      'S': 8000,
      'M': 12000,
      'L': 20000
    };
    let precio = precios[formData.datosPaquete.tamano] || 0;

    // Agregar costo por embalaje si se requiere
    if (formData.datosPaquete.requiereEmbalaje) {
      precio += 2000;
    }

    // Agregar costo por manejo especial si es frágil
    if (formData.datosPaquete.fragil) {
      precio += 3000;
    }

    return precio;
  }

  private marcarCamposInvalidos(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        this.marcarCamposInvalidos(control);
      } else {
        if (control.invalid) {
          control.markAsTouched();
        }
      }
    });
  }

  private actualizarCamposFaltantes() {
    this.camposFaltantes = [];
    this.verificarCamposFaltantes(this.despachoForm);
  }

  private verificarCamposFaltantes(formGroup: FormGroup, parentName: string = '') {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.verificarCamposFaltantes(control, key);
      } else if (control?.invalid && control?.touched) {
        this.camposFaltantes.push(this.obtenerNombreCampo(key, parentName));
      }
    });
  }

  private obtenerNombreCampo(key: string, parentName: string): string {
    const campos: { [key: string]: string } = {
      'nombre': 'Nombre completo',
      'email': 'Correo electrónico',
      'telefono': 'Teléfono',
      'region': 'Región',
      'comuna': 'Comuna',
      'direccion': 'Dirección',
      'tamano': 'Tamaño del paquete',
      'peso': 'Peso',
      'descripcion': 'Descripción del contenido'
    };
    
    return campos[key] || key;
  }

  getComunas(region: string): any[] {
    return region ? this.comunasPorRegion[region] || [] : [];
  }

  getErrorMessage(control: any, fieldName: string): string {
    if (!control) return '';
    
    if (control.hasError('required')) {
      return `El campo ${fieldName} es requerido`;
    }
    if (control.hasError('email')) {
      return 'El correo electrónico no es válido';
    }
    if (control.hasError('pattern')) {
      if (fieldName === 'teléfono') {
        return 'Ingrese un número de 9 dígitos';
      }
    }
    if (control.hasError('minlength')) {
      return `El campo debe tener al menos ${control.errors.minlength.requiredLength} caracteres`;
    }
    if (control.hasError('min')) {
      return `El valor mínimo es ${control.errors.min.min}`;
    }
    if (control.hasError('max')) {
      return `El valor máximo es ${control.errors.max.max}`;
    }
    return '';
  }
} 