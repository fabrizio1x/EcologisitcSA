import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import {
  ChartConfiguration,
  ChartData,
  ChartType
} from 'chart.js';
import { Chart } from 'chart.js/auto';
import { PedidoService } from '../services/pedido.service';
import { ChoferService } from '../services/chofer.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '../auth/auth.service';

interface RankingChofer {
  nombre: string;
  entregasCompletadas: number;
  tasaExito: number;
  calificacion: number;
}

@Component({
  selector: 'app-gerencia',
  templateUrl: './gerencia.component.html',
  styleUrls: ['./gerencia.component.scss']
})
export class GerenciaComponent implements OnInit, OnDestroy {
  // Referencias a los canvas para los gráficos
  @ViewChild('estadoPedidosChart') estadoPedidosChartRef!: ElementRef;
  @ViewChild('regionesChart') regionesChartRef!: ElementRef;

  // Estadísticas generales
  totalPedidos: number = 0;
  pedidosSemana: number = 0;
  pedidosMes: number = 0;
  pedidosTrimestre: number = 0;

  // Datos para gráficos
  estadoPedidosChart: Chart<'doughnut', number[], string> | null = null;
  regionesChart: Chart<'bar', number[], string> | null = null;

  // Ranking de choferes
  rankingChoferes: RankingChofer[] = [];

  pedidosChart: any;
  ciudadesChart: any;

  private destroy$ = new Subject<void>();

  constructor(
    private pedidoService: PedidoService,
    private choferService: ChoferService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Verificar rol de gerencia
    this.authService.currentUser$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((user: User | null) => {
      if (!user || user.role !== 'gerencia') {
        this.router.navigate(['/inicio']);
        return;
      }
      this.cargarDatos();
    });

    this.initializeCharts();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Destruir los gráficos para evitar memory leaks
    if (this.estadoPedidosChart) {
      this.estadoPedidosChart.destroy();
    }
    if (this.regionesChart) {
      this.regionesChart.destroy();
    }
  }

  async cargarDatos() {
    try {
      await Promise.all([
        this.cargarEstadisticas(),
        this.cargarRankingChoferes()
      ]);

      // Inicializar gráficos después de cargar los datos
      setTimeout(() => {
        this.inicializarGraficos();
      }, 0);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  }

  private async cargarEstadisticas() {
    const fechaActual = new Date();
    const inicioSemana = new Date(fechaActual);
    inicioSemana.setDate(fechaActual.getDate() - fechaActual.getDay());
    
    const inicioMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    
    const inicioTrimestre = new Date(fechaActual);
    inicioTrimestre.setMonth(Math.floor(fechaActual.getMonth() / 3) * 3);
    inicioTrimestre.setDate(1);

    try {
      const [total, semana, mes, trimestre] = await Promise.all([
        this.pedidoService.contarPedidos(),
        this.pedidoService.contarPedidosPorFecha(inicioSemana),
        this.pedidoService.contarPedidosPorFecha(inicioMes),
        this.pedidoService.contarPedidosPorFecha(inicioTrimestre)
      ]);

      this.totalPedidos = total;
      this.pedidosSemana = semana;
      this.pedidosMes = mes;
      this.pedidosTrimestre = trimestre;
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  }

  private async cargarRankingChoferes() {
    try {
      this.rankingChoferes = await this.choferService.obtenerRankingChoferes();
    } catch (error) {
      console.error('Error al cargar ranking de choferes:', error);
    }
  }

  private inicializarGraficos() {
    this.inicializarGraficoEstados();
    this.inicializarGraficoRegiones();
  }

  private inicializarGraficoEstados() {
    const ctx = this.estadoPedidosChartRef.nativeElement.getContext('2d');
    
    this.estadoPedidosChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completados', 'En Proceso', 'Pendientes', 'Cancelados'],
        datasets: [{
          data: [65, 20, 10, 5],
          backgroundColor: [
            'rgba(92, 184, 92, 0.8)',
            'rgba(91, 192, 222, 0.8)',
            'rgba(240, 173, 78, 0.8)',
            'rgba(217, 83, 79, 0.8)'
          ],
          borderColor: [
            'rgba(92, 184, 92, 1)',
            'rgba(91, 192, 222, 1)',
            'rgba(240, 173, 78, 1)',
            'rgba(217, 83, 79, 1)'
          ],
          borderWidth: 2,
          hoverOffset: 15,
          borderRadius: 5,
          spacing: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              color: '#5c9474',
              font: {
                size: 14
              },
              usePointStyle: true
            }
          },
          title: {
            display: true,
            text: 'Estado de Pedidos',
            color: '#5c9474',
            font: {
              size: 18
            },
            padding: 20
          }
        },
        animation: {
          animateScale: true,
          animateRotate: true,
          duration: 2000,
          easing: 'easeInOutQuart'
        }
      }
    });
  }

  private inicializarGraficoRegiones() {
    const ctx = this.regionesChartRef.nativeElement.getContext('2d');
    
    this.regionesChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Santiago', 'Valparaíso', 'Temuco'],
        datasets: [{
          label: 'Pedidos por Ciudad',
          data: [300, 150, 100],
          backgroundColor: [
            'rgba(92, 184, 92, 0.8)',
            'rgba(92, 184, 92, 0.6)',
            'rgba(92, 184, 92, 0.4)'
          ],
          borderColor: [
            'rgba(92, 184, 92, 1)',
            'rgba(92, 184, 92, 1)',
            'rgba(92, 184, 92, 1)'
          ],
          borderWidth: 2,
          borderRadius: 10,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Pedidos por Ciudad',
            color: '#5c9474',
            font: {
              size: 18
            },
            padding: 20
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(92, 148, 116, 0.1)',
              lineWidth: 0.5
            },
            ticks: {
              color: '#5c9474'
            }
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              color: '#5c9474',
              font: {
                size: 14
              }
            }
          }
        },
        animation: {
          delay: (context: any) => {
            return (context.raw as number) * 100;
          },
          duration: 2000,
          easing: 'easeInOutQuart'
        }
      }
    });
  }

  private initializeCharts() {
    this.createPedidosChart();
    this.createCiudadesChart();
  }

  private createPedidosChart() {
    const ctx = document.getElementById('pedidosChart') as HTMLCanvasElement;
    this.pedidosChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completados', 'En Proceso', 'Pendientes', 'Cancelados'],
        datasets: [{
          data: [65, 20, 10, 5],
          backgroundColor: [
            'rgba(92, 184, 92, 0.8)',
            'rgba(91, 192, 222, 0.8)',
            'rgba(240, 173, 78, 0.8)',
            'rgba(217, 83, 79, 0.8)'
          ],
          borderColor: [
            'rgba(92, 184, 92, 1)',
            'rgba(91, 192, 222, 1)',
            'rgba(240, 173, 78, 1)',
            'rgba(217, 83, 79, 1)'
          ],
          borderWidth: 2,
          hoverOffset: 15,
          borderRadius: 5,
          spacing: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              color: '#5c9474',
              font: {
                size: 14
              },
              usePointStyle: true
            }
          },
          title: {
            display: true,
            text: 'Estado de Pedidos',
            color: '#5c9474',
            font: {
              size: 18
            },
            padding: 20
          }
        },
        animation: {
          animateScale: true,
          animateRotate: true,
          duration: 2000,
          easing: 'easeInOutQuart'
        }
      }
    });
  }

  private createCiudadesChart() {
    const ctx = document.getElementById('ciudadesChart') as HTMLCanvasElement;
    this.ciudadesChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Santiago', 'Valparaíso', 'Temuco'],
        datasets: [{
          label: 'Pedidos por Ciudad',
          data: [300, 150, 100],
          backgroundColor: [
            'rgba(92, 184, 92, 0.8)',
            'rgba(92, 184, 92, 0.6)',
            'rgba(92, 184, 92, 0.4)'
          ],
          borderColor: [
            'rgba(92, 184, 92, 1)',
            'rgba(92, 184, 92, 1)',
            'rgba(92, 184, 92, 1)'
          ],
          borderWidth: 2,
          borderRadius: 10,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Pedidos por Ciudad',
            color: '#5c9474',
            font: {
              size: 18
            },
            padding: 20
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(92, 148, 116, 0.1)',
              lineWidth: 0.5
            },
            ticks: {
              color: '#5c9474'
            }
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              color: '#5c9474',
              font: {
                size: 14
              }
            }
          }
        },
        animation: {
          delay: (context: any) => {
            return (context.raw as number) * 100;
          },
          duration: 2000,
          easing: 'easeInOutQuart'
        }
      }
    });
  }
} 