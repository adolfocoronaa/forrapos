export interface Venta {
    id: number;
    folio: string,
    fecha: string; // o Date
    total: number;
    estado: string;
    detalles: DetalleVenta[];
    seleccionado: boolean;
    metodoPago: string;
    editando: boolean;
  }
  
  export interface DetalleVenta {
    productoId: number;
    producto: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }
  