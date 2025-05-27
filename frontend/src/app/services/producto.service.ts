/**
 * Servicio ProductoService
 * -------------------------
 * Servicio Angular para interactuar con el backend de productos.
 * Realiza una solicitud HTTP GET para obtener la lista de productos.
 *
 * Funcionalidades:
 * - Obtener productos desde el backend
 *
 * Fecha: 20/03/2025
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Interfaz que define la estructura esperada de un producto
 */
interface Producto {
  id: number;
  name: string;
  price: number;
  stock: number;
}

@Injectable({
  providedIn: 'root' // Hace el servicio disponible globalmente como singleton
})
export class ProductoService {

  /**
   * URL del endpoint del backend para productos
   */
  private apiUrl = 'http://localhost:5233/api/productos';

  /**
   * Constructor que inyecta el cliente HTTP de Angular
   * @param http - Cliente HTTP utilizado para hacer peticiones a la API
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de productos desde el backend
   * @returns Observable con un arreglo de productos
   */
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }
}
