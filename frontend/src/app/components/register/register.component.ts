import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, NonNullableFormBuilder, AbstractControl, ValidationErrors, Validators } from '@angular/forms';
import { RegisterService } from '../../services/register.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { mismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: NonNullableFormBuilder, private registerService: RegisterService) {
    this.registerForm = this.fb.group({
      name: this.fb.control('', Validators.required),
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: this.fb.control('', Validators.required)
    }, { validators: passwordMatchValidator });
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {
      this.errorMessage = 'Por favor, completa correctamente el formulario.';
      return;
    }

    const name = this.registerForm.get('name')?.value;
    const email = this.registerForm.get('email')?.value;
    const password = this.registerForm.get('password')?.value;

    this.registerService.register({ name, email, password }).subscribe({
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
