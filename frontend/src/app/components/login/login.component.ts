import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private loginService: LoginService) {
    this.loginForm = this.fb.group({
      name: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, completa correctamente el formulario.';
      return;
    }

    const { name, password } = this.loginForm.value;

    this.loginService.login(name, password).subscribe({
      next: (response) => {
        console.log('Login exitoso', response);
        // Aquí puedes guardar el token en localStorage o redirigir a otra página
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al iniciar sesión.';
      }
    });
  }
}
