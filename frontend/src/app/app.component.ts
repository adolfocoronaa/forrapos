/**
 * Componente AppComponent
 * ------------------------
 * Componente raíz de la aplicación Angular.
 * Contiene el contenedor principal y el <router-outlet> para renderizar rutas hijas.
 * 
 * Funcionalidades:
 * - Sirve como punto de entrada visual para la aplicación.
 * - Carga dinámicamente los componentes según la ruta activa.
 * 
 * Fecha: 20/03
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root', // Selector raíz utilizado en index.html
  standalone: true,     // Componente standalone que no requiere NgModule
  imports: [CommonModule, RouterModule, RouterOutlet], // Módulos necesarios para renderizado y rutas
  template: `
    <!-- Contenedor principal de la aplicación con estilos utilitarios -->
    <div class="min-h-screen bg-gray-100 text-center">
      <!-- Aquí se inyectan dinámicamente las vistas según la ruta -->
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.component.css'] // Estilos globales del componente
})
export class AppComponent {
  /**
   * Título de la aplicación, puede usarse para propósitos internos o de UI
   */
  title = 'frontend';
}
