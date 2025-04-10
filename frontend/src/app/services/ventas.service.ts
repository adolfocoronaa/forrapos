import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Venta } from '../components/ventas/venta.model';

@Injectable({ providedIn: 'root' })
export class VentasService {
  private apiUrl = 'http://localhost:5233/api/ventas';
  private productosUrl = 'http://localhost:5233/api/productos';

  constructor(private http: HttpClient) {}

  // Obtener todas las ventas
  getVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.apiUrl);
  }

  // Crear una nueva venta
  crearVenta(venta: any): Observable<any> {
    return this.http.post(this.apiUrl, venta);
  }

  // Obtener lista de productos (para el modal de ventas)
  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.productosUrl);
  }
}
