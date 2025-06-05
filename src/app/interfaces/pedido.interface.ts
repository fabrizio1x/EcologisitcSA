export interface Pedido {
  id: string;
  numeroSeguimiento: string;
  clienteId: string;
  clienteEmail?: string;
  clienteNombre?: string;
  estado: EstadoPedido;
  fechaCreacion: Date;
  fechaActualizacion?: Date;
  comentario?: string;
  choferId?: string;
  
  // Campos para compatibilidad con datos existentes
  tamanoPaquete?: string;
  peso?: number;
  descripcion?: string;
  fragil?: boolean;
  requiereEmbalaje?: boolean;
  direccionRetiro?: {
    direccion: string;
    comuna: string;
    region: string;
    referencias?: string;
  };
  direccionEntrega?: {
    direccion: string;
    comuna: string;
    region: string;
    referencias?: string;
  };

  // Nuevos campos estructurados
  origen: {
    direccion: string;
    comuna: string;
    region: string;
    referencias?: string;
  };
  destino: {
    direccion: string;
    comuna: string;
    region: string;
    referencias?: string;
  };
  datosPaquete: {
    tamano: string;
    peso: number;
    descripcion: string;
    fragil: boolean;
    requiereEmbalaje: boolean;
  };
  coordenadasOrigen?: [number, number]; // [latitud, longitud]
  coordenadasDestino?: [number, number]; // [latitud, longitud]
}

export type EstadoPedido = 'pendiente' | 'en_proceso' | 'en_ruta' | 'en_camino' | 'entregado' | 'no_recibido' | 'cancelado'; 