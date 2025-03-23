/**
 * Componente DashboardComponent
 * -----------------------------
 * Este componente representa el panel principal del sistema POS.
 * Verifica si el usuario actual es administrador y ajusta el contenido en función de su rol.
 *
 * Funcionalidades:
 * - Determina si el usuario es administrador mediante el valor almacenado en localStorage.
 * - Permite mostrar u ocultar secciones del dashboard con base en el rol.
 *
 * Fecha: 20/03/2025
 * Dependencias: Angular CommonModule, ReactiveFormsModule, FormsModule
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard', // Selector que se utiliza para insertar el componente en HTML
  standalone: true,          // Este componente es standalone (no necesita declararse en un módulo)
  imports: [CommonModule, ReactiveFormsModule, FormsModule], // Módulos necesarios para la plantilla
  templateUrl: './dashboard.component.html', // Ruta a la plantilla HTML del dashboard
  styleUrls: ['./dashboard.component.css']   // Archivo de estilos específico del componente
})
export class DashboardComponent {

  /**
   * Bandera que determina si el usuario actual tiene permisos de administrador.
   * Esta propiedad controla la visibilidad de elementos exclusivos del rol administrador.
   */
  isAdmin: boolean = false;

  /**
   * Constructor del componente
   * Realiza una verificación en localStorage para establecer el rol del usuario.
   * Si el rol es "Administrador", habilita funciones y vistas adicionales.
   */
  constructor() {
    const userRole = localStorage.getItem('rol'); // El rol del usuario se espera como string en localStorage

    if (userRole === 'Administrador') {
      this.isAdmin = true;
    }
  }
}
