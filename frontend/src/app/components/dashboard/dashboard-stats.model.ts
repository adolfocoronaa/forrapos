export interface DashboardStats {
    ventasHoy: number;
    ventasSemana: number;
    itemsVendidosHoy: number;
    ordenesActivas: number;
    alertas: { name: string; stock: number }[];
  }
  