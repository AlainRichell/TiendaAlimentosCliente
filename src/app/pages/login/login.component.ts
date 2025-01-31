import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./login.component.html",
})
export class LoginComponent {
  email: string = "";
  password: string = "";
  emailError: string = "";
  passwordError: string = "";

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    // Limpia los errores previos
    this.clearErrors();

    // Validación local
    if (!this.validateForm()) {
      return;
    }

    // Intentar iniciar sesión
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(["/"]);
      },
      error: (error) => {
        // Mostrar errores provenientes del backend
        if (error.error?.email) {
          this.emailError = error.error.email;
        }
        if (error.error?.password) {
          this.passwordError = error.error.password;
        }
      },
    });
  }

  private clearErrors() {
    this.emailError = "";
    this.passwordError = "";
  }

  private validateForm(): boolean {
    let isValid = true;

    if (!this.email || !this.email.includes("@")) {
      this.emailError = "Por favor, ingresa una dirección de correo válida.";
      isValid = false;
    }

    if (!this.password || this.password.length < 6) {
      this.passwordError = "La contraseña debe tener al menos 6 caracteres.";
      isValid = false;
    }

    return isValid;
  }
}
