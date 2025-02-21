import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Asegura que venga de @angular/common/http
import { Observable } from 'rxjs';

interface Producto {
  id: number;
  name: string;
  price: number;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:5233/api/productos';

  constructor(private http: HttpClient) { }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }
}
