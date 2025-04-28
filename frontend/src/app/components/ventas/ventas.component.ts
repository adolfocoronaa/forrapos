import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VentasService } from '../../services/ventas.service';
import { Venta } from './venta.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';



@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  @ViewChild('modalNuevaVenta') modalElementRef!: ElementRef;
  ventas: Venta[] = [];
  ventasFiltradas: Venta[] = [];
  productos: any[] = [];
  productoSeleccionado: any = null;
  cantidadSeleccionada: number = 1;
  busqueda: string = '';
  paginaActual: number = 1;
  ventasPorPagina: number = 5;
  yearsArray: number[] = [];
  ventaSeleccionada: Venta | null = null;
  mostrarModalDetalles: boolean = false;
  meses: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  nuevaVenta: any = {
    metodoPago: '',
    total: 0,
    detalles: []
  };

  // Filtros
  filtroEstado: string = '';
  filtroMes: string = '';
  filtroYear: string = '';
  filtroMin: number | null = null;
  filtroMax: number | null = null;
  filtroProducto: string = '';

  constructor(private ventasService: VentasService, private toast: ToastService) {}

  ngOnInit(): void {
    this.cargarVentas();
    this.cargarProductos();
    const currentYear = new Date().getFullYear();
    for (let year = 2025; year <= currentYear; year++) {
      this.yearsArray.push(year);
    }
  }

  cargarVentas() {
    const params: any = {};
  
    if (this.filtroYear) params.year = this.filtroYear;
    if (this.filtroMes && this.filtroMes !== 'Todo') params.mes = this.meses.indexOf(this.filtroMes) + 1;
    if (this.filtroEstado) params.estado = this.filtroEstado;
    if (this.filtroMin != null) params.minTotal = this.filtroMin;
    if (this.filtroMax != null) params.maxTotal = this.filtroMax;
    if (this.filtroProducto) params.producto = this.filtroProducto;
  
    this.ventasService.getVentasFiltradas(params).subscribe(data => {
      this.ventas = data;
      this.ventasFiltradas = data;
    });
  }
  

  cargarProductos() {
    this.ventasService.getProductos().subscribe(data => {
      this.productos = data;
    });
  }

  aplicarFiltros() {
    const filtros = {
      estado: this.filtroEstado,
      year: this.filtroYear,
      mes: this.filtroMes === 'Todo' || !this.filtroMes
        ? ''
        : this.meses.indexOf(this.filtroMes) + 1, 
      minTotal: this.filtroMin,
      maxTotal: this.filtroMax,
      producto: this.filtroProducto
    };
  
    this.ventasService.getVentasFiltradas(filtros).subscribe(data => {
      this.ventasFiltradas = data;
      this.paginaActual = 1;
    });
  }
  

  limpiarFiltros() {
    this.filtroEstado = '';
    this.filtroMes = '';
    this.filtroYear = '';
    this.filtroMin = null;
    this.filtroMax = null;
    this.busqueda = '';
    this.filtroProducto = '';
    this.aplicarFiltros();
  }

  agregarProducto() {
    if (!this.productoSeleccionado || this.cantidadSeleccionada < 1) return;

    const detalle = {
      productoId: this.productoSeleccionado.id,
      producto: this.productoSeleccionado,
      cantidad: this.cantidadSeleccionada,
      precioUnitario: this.productoSeleccionado.price,
      subtotal: this.productoSeleccionado.price * this.cantidadSeleccionada
    };

    this.nuevaVenta.detalles.push(detalle);
    this.calcularTotal();

    this.productoSeleccionado = null;
    this.cantidadSeleccionada = 1;
  }

  quitarProducto(index: number) {
    this.nuevaVenta.detalles.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal() {
    this.nuevaVenta.total = this.nuevaVenta.detalles.reduce((sum: number, d: any) => sum + d.subtotal, 0);
  }

  registrarVenta() {
    const payload = {
      metodoPago: this.nuevaVenta.metodoPago,
      total: this.nuevaVenta.total,
      folio: '', // se generará en backend, solo se necesita que esté presente
      detalles: this.nuevaVenta.detalles.map((d: any) => ({
        productoId: d.productoId,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario
      }))
    };

      // Validación básica
    if (!payload.metodoPago || payload.detalles.length === 0) {
      alert('Debe seleccionar un método de pago y al menos un producto.');
      return;
    }

    this.ventasService.crearVenta(payload).subscribe(() => {

      this.nuevaVenta = { metodoPago: '', total: 0, detalles: [] };
    
      this.cargarVentas();
    }, (error) => {
      alert('Error: Verifica los datos ingresados.');
    });
  }

  // Paginación
  get ventasPaginadas() {
    const inicio = (this.paginaActual - 1) * this.ventasPorPagina;
    return this.ventasFiltradas.slice(inicio, inicio + this.ventasPorPagina);
  }

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
  }

  totalPaginas(): number[] {
    const total = Math.ceil(this.ventasFiltradas.length / this.ventasPorPagina);
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // Marcar todos como seleccionados o no
  toggleSeleccionarTodas(event: any) {
    const checked = event.target.checked;
    this.ventasPaginadas.forEach(v => v.seleccionado = checked);
  }

  // Acciones personalizadas
  editarVenta(venta: any) {
    venta.editando = true;

    // Convertir fecha a formato para datetime-local
    venta.fecha = this.dateFormat(venta.fecha);

    venta.detalles = venta.detalles.map((d: any) => {
    const productoEncontrado = this.productos.find(p => p.name === d.producto);
    return {
      productoId: productoEncontrado ? productoEncontrado.id : null,
      cantidad: d.cantidad,
      precioUnitario: d.precioUnitario,
      subtotal: d.subtotal
    };
  });
  }

  generarReporte(venta: Venta) {
    console.log("Generando PDF para:", venta);
  }

  eliminarVenta(venta: Venta) {
    if (confirm(`¿Eliminar venta ${venta.folio}?`)) {
      console.log("Eliminando venta:", venta);
      // Lógica para backend aquí
    }
  }

  verDetalles(venta: Venta) {
    this.ventaSeleccionada = venta;
    this.mostrarModalDetalles = true;
  }
  
  duplicarVenta(venta: Venta) {
    this.nuevaVenta = {
      metodoPago: venta.estado === "Completado" ? venta.metodoPago : '',
      total: venta.total,
      detalles: venta.detalles.map(d => ({
        producto: d.producto,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        subtotal: d.subtotal
      }))
    };
    console.log('Venta duplicada lista para registrar');
  }
  
  enviarPorCorreo(venta: Venta) {
    // Podrías conectar con un servicio de backend que genere PDF y lo envíe
    alert(`Se enviará la venta ${venta.folio} por correo 📧`);
  }
  
  imprimirVenta(venta: Venta) {
    // Implementa lógica para generar PDF y abrir en nueva ventana o imprimir
    alert(`Preparando impresión para ${venta.folio} 🖨️`);
  }
  
  guardarVenta(v: any) {
    const detallesValidos = v.detalles.map((d: any) => ({
      productoId: d.productoId,
      cantidad: d.cantidad,
      precioUnitario: d.precioUnitario
    }));
  
    const payload = {
      fecha: v.fecha,
      metodoPago: v.metodoPago,
      detalles: detallesValidos
    };
  
    this.ventasService.actualizarVenta(v.id, payload).subscribe(() => {
      this.toast.showSuccess('Venta actualizada exitosamente');
      v.editando = false;
      this.cargarVentas(); // Recarga para ver los nuevos totales
    }, err => {
      this.toast.showError('Error al actualizar la venta');
    });
  }

  dateFormat(fechaOriginal: any): string {
    const fecha = new Date(fechaOriginal);
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getDate().toString().padStart(2, '0');
    const hours = fecha.getHours().toString().padStart(2, '0');
    const minutes = fecha.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  recalcularTotal(venta: any) {
    venta.total = venta.detalles.reduce((sum: number, d: any) => sum + (d.cantidad * d.precioUnitario), 0);
  }  
}
