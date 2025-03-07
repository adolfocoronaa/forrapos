import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:5233/api/auth/login'; // Ajusta la URL según tu API

  constructor(private http: HttpClient) {}

  login(name: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { name, password });
  }
}
