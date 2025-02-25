import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet], // 📌 Asegúrate de incluir RouterModule
  template: `
    <div class="min-h-screen bg-gray-100 text-center">
      <nav class="bg-blue-600 p-4 text-white">
        <a routerLink="/login" class="px-4" routerLinkActive="font-bold">Login</a> |
        <a routerLink="/register" class="px-4" routerLinkActive="font-bold">Registro</a> |
        <a routerLink="/productos" class="px-4" routerLinkActive="font-bold">Productos</a>
      </nav>
      <div class="container mx-auto mt-5">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
}
