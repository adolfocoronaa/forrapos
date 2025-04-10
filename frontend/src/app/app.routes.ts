/**
 * Archivo de rutas de la aplicación
 * ----------------------------------
 * Define las rutas principales y las vistas asociadas a cada una.
 * Utiliza guardas de autenticación para proteger el acceso a rutas sensibles.
 *
 * Funcionalidades:
 * - Navegación entre componentes
 * - Redirección por defecto
 * - Protección de rutas con `AuthGuard`
 *
 * Fecha: 20/03/2025
 */

import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProductosComponent } from './components/productos/productos.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthGuard } from './guards/auth.guard';
import { VentasComponent } from './components/ventas/ventas.component';

/**
 * Rutas principales del sistema
 */
export const routes: Routes = [
  /** Ruta para inicio de sesión */
  { path: 'login', component: LoginComponent },

  /** Ruta para consultar productos */
  { path: 'productos', component: ProductosComponent },

  /** Ruta principal del dashboard */
  { path: 'dashboard', component: DashboardComponent },

  /** Ruta para la administración de usuarios (protegida por AuthGuard) */
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },

  /** Ruta para inicio de sesión */
  { path: 'venta', component: VentasComponent },

  /** Ruta comodín: redirige cualquier otra ruta a login */
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
