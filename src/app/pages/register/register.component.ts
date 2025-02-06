import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./register.component.html",
})
export class RegisterComponent {
  user = {
    fullName: "",
    email: "",
    phone: "",
    address: "",
  };
  password: string = "";

  errors: Record<string, string> = {}; // Para almacenar los mensajes de error

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.validateForm()) {
      this.authService
        .register({ ...this.user, password: this.password })
        .subscribe({
          next: () => {
            this.router.navigate(["/login"]);
          },
          error: (error) => {
            console.error("Error en el registro:", error);
            this.errors = error.error || {};
          },
        });
    }
  }

  private validateForm(): boolean {
    this.errors = {}; // Limpiar errores previos
    let isValid = true;

    if (!this.user.fullName.trim()) {
      this.errors["fullName"] = "El nombre no puede estar vacío.";
      isValid = false;
    }
    if (!this.isValidEmail(this.user.email)) {
      this.errors["email"] = "El correo electrónico no es válido.";
      isValid = false;
    }
    if (!this.isValidPhone(this.user.phone)) {
      this.errors["phone"] = "El número telefónico no es válido.";
      isValid = false;
    }
    if (!this.user.address.trim()) {
      this.errors["address"] = "La dirección no puede estar vacía.";
      isValid = false;
    }
    if (this.password.length < 6) {
      this.errors["password"] =
        "La contraseña debe tener al menos 6 caracteres.";
      isValid = false;
    }

    return isValid;
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phonePattern = /^[0-9]{10}$/; // Regex: números de 10 dígitos
    return phonePattern.test(phone);
  }
}
