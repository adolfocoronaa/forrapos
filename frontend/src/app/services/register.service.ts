import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private apiUrl = 'http://localhost:5233/api/auth/register';

  constructor(private http: HttpClient) {}

  register(user: { name: string, email: string, password: string, rol: string }): Observable<any> {
    console.log('Registro usuario:', user); // Verifica los datos que se envían
    return this.http.post<any>(this.apiUrl, user);
  }
}

