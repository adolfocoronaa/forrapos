import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  isAdmin: boolean = false; // Cambia a true si es un administrador

  constructor() {
    const userRole = localStorage.getItem('rol'); // Se asume que el rol está guardado aquí
    if (userRole === 'Administrador') {
      this.isAdmin = true;
    }
  }
}
