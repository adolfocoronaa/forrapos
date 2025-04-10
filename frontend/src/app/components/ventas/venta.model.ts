export interface Venta {
    id: number;
    fecha: string; // o Date
    total: number;
    estado: string;
    detalles: DetalleVenta[];
  }
  
  export interface DetalleVenta {
    producto: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }
  