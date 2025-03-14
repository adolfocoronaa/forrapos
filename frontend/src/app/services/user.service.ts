import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5233/api/auth';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  updateUserRole(userId: number, newRole: string, adminEmail: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-role/${userId}`, { newRole }, {
      headers: { 'adminEmail': adminEmail, 'Content-Type': 'application/json' }
    });
  }
  

}
