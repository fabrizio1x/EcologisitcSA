import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historial-pedidos',
  templateUrl: './historial-pedidos.component.html',
  styleUrls: ['./historial-pedidos.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class HistorialPedidosComponent implements OnInit {
  constructor() { }

  ngOnInit() {}
}
