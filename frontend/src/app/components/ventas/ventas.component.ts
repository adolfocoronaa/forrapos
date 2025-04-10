import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VentasService } from '../../services/ventas.service';
import { Venta } from './venta.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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

  constructor(private ventasService: VentasService) {}

  ngOnInit(): void {
    this.cargarVentas();
    this.cargarProductos();
    const currentYear = new Date().getFullYear();
    for (let year = 2025; year <= currentYear; year++) {
      this.yearsArray.push(year);
    }
  }

  cargarVentas() {
    this.ventasService.getVentas().subscribe(data => {
      this.ventas = data;
      this.aplicarFiltros();
    });
  }

  cargarProductos() {
    this.ventasService.getProductos().subscribe(data => {
      this.productos = data;
    });
  }

  aplicarFiltros() {
    this.ventasFiltradas = this.ventas.filter(v => {
      const fecha = new Date(v.fecha);
      const cumpleEstado = this.filtroEstado ? v.estado === this.filtroEstado : true;
      const cumpleMes = this.filtroMes ? fecha.getMonth() + 1 === +this.filtroMes : true;
      const cumpleYear = this.filtroYear ? fecha.getFullYear() === +this.filtroYear : true;
      const cumplePrecioMin = this.filtroMin != null ? v.total >= this.filtroMin : true;
      const cumplePrecioMax = this.filtroMax != null ? v.total <= this.filtroMax : true;
      const cumpleBusqueda = this.busqueda ? JSON.stringify(v).toLowerCase().includes(this.busqueda.toLowerCase()) : true;
      const cumpleProducto = this.filtroProducto ? v.detalles.some(d => d.producto.toLowerCase().includes(this.filtroProducto.toLowerCase())) : true;
      return cumpleEstado && cumpleMes && cumpleYear && cumplePrecioMin && cumplePrecioMax && cumpleBusqueda && cumpleProducto;
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
      detalles: this.nuevaVenta.detalles.map((d: any) => ({
        productoId: d.productoId,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario
      }))
    };

    this.ventasService.crearVenta(payload).subscribe(() => {
      alert('Venta registrada correctamente');

      this.nuevaVenta = { metodoPago: '', total: 0, detalles: [] };
    
      this.cargarVentas();
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
}
