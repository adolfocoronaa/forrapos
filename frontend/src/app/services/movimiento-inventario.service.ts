import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovimientoInventario } from '../components/movimiento-inventario/movimiento-inventario.model';
import { Producto } from '../components/productos/productos.model';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  // ajusta la URL base si tu API está en otra ruta/puerto
  private apiBase = 'http://localhost:5233/api';

  constructor(private http: HttpClient) {}

  getMovimientos(): Observable<MovimientoInventario[]> {
    return this.http.get<MovimientoInventario[]>(`${this.apiBase}/inventario`);
  }

  registrarMovimiento(mov: MovimientoInventario): Observable<any> {
    return this.http.post(`${this.apiBase}/inventario`, mov);
  }

  // Endpoint para obtener productos (si no quieres usar ProductoService)
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiBase}/productos`);
  }
}
