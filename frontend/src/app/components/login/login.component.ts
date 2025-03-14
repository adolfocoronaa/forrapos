import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../../services/register.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { mismatch: true };
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router,
              private registerService: RegisterService
  ) {
    this.loginForm = this.fb.group({
      name: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      rol: ['Empleado', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  onSubmit() {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, completa correctamente el formulario.';
      return;
    }

    const { name, password, rememberMe } = this.loginForm.value;

    this.loginService.login(name, password).subscribe({
      next: (response) => {
        const { usuario } = response;
        localStorage.setItem('rol', usuario.rol);
        localStorage.setItem('email', usuario.email)
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify({ name }));
        }
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al iniciar sesión.';
      }
    });
  }

  onSubmitRegister() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {
      this.errorMessage = 'Por favor, completa correctamente el formulario.';
      return;
    }

    const { name, email, password, rol } = this.registerForm.value;

    this.registerService.register({ name, email, password, rol }).subscribe({
      next: () => {
        this.successMessage = 'Usuario registrado con éxito.';
        this.registerForm.reset();
      },
      error: (err: { error: { message: string; }; }) => {
        this.errorMessage = err.error?.message || 'Error al registrar usuario.';
      }
    });
  }
}
