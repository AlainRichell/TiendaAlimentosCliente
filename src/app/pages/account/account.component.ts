import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms"; // Importa Validators
import { UserService } from "../../core/services/user.service";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AccountComponent implements OnInit {
  userForm: FormGroup;
  isEditing: boolean = false;
  userId: number;
  passwordForm: FormGroup; // Nuevo formulario para cambiar contraseña
  isChangingPassword: boolean = false; // Estado para mostrar/ocultar el formulario de cambio de contraseña

  constructor(private userService: UserService, private fb: FormBuilder) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    this.userId = currentUser?.user_id || null;

    // Añadir validaciones
    this.userForm = this.fb.group({
      username: [{ value: "", disabled: true }], // Campo deshabilitado
      email: [{ value: "", disabled: true }], // Campo deshabilitado
      first_name: [
        "",
        [
          Validators.required,
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/), // Validación: solo letras, espacios, tildes y ñ
        ],
      ],
      phone: [
        "",
        [
          Validators.required,
          Validators.minLength(8), // Mínimo 8 caracteres
          Validators.pattern(/^[0-9]+$/), // Solo números
        ],
      ],
      address: ["", [Validators.required, Validators.minLength(5)]],
    });

    this.passwordForm = this.fb.group({
      newPassword: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getUserId();
    this.loadUserData();
  }

  getUserId() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    this.userId = currentUser?.user_id || null;
  }

  loadUserData() {
    if (this.userId) {
      this.userService.getUser(this.userId).subscribe({
        next: (data) => {
          this.userForm.patchValue({
            username: data.username,
            email: data.email,
            first_name: data.first_name,
            phone: data.profile?.phone,
            address: data.profile?.address,
          });
        },
        error: (err) => {
          console.error("Error al cargar los datos del usuario:", err);
        },
      });
    } else {
      console.error("User ID no encontrado en localStorage");
    }
  }

  enableEditing() {
    this.isEditing = true;
    this.userForm.enable(); // Habilitar todos los campos
    this.userForm.controls["username"].disable(); // Re-deshabilitar username
    this.userForm.controls["email"].disable(); // Re-deshabilitar email
  }

  cancelEditing() {
    this.isEditing = false;
    this.loadUserData();
    this.userForm.disable(); // Deshabilitar todos los campos
  }

  saveChanges() {
    if (this.userForm.valid && this.userId) {
      const updatedData = {
        ...this.userForm.value,
        profile: {
          phone: this.userForm.value.phone,
          address: this.userForm.value.address,
        },
      };

      this.userService.updateUser(this.userId, updatedData).subscribe({
        next: () => {
          this.isEditing = false;
          alert("Datos actualizados con éxito");
        },
        error: (err) => {
          console.error("Error al actualizar los datos:", err);
        },
      });
    } else {
      alert("Por favor, corrige los errores antes de guardar.");
    }
  }

  // Métodos para mostrar mensajes de error
  getFieldError(field: string): string | null {
    const control = this.userForm.get(field);
    if (control?.touched || this.isEditing) {
      if (control?.hasError("required")) return "Este campo es obligatorio.";
      if (control?.hasError("minlength"))
        return `Debe tener al menos ${control.errors?.["minlength"].requiredLength} caracteres.`;
      if (control?.hasError("pattern")) {
        if (field === "first_name")
          return "El nombre solo puede contener letras.";
        if (field === "phone")
          return "El teléfono solo puede contener números.";
      }
    }
    return null;
  }

  changePassword() {
    // Marcar todos los campos como "touched" para mostrar errores
    this.passwordForm.markAllAsTouched();

    if (this.passwordForm.valid) {
      const { newPassword, confirmPassword } = this.passwordForm.value;

      if (newPassword !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
      }

      // Llamada al servicio para actualizar la contraseña
      this.userService.changePassword(this.userId, newPassword).subscribe({
        next: () => {
          alert("Contraseña actualizada con éxito");
          this.isChangingPassword = false; // Ocultar el formulario después del cambio
          this.passwordForm.reset(); // Limpiar el formulario
        },
        error: (err) => {
          console.error("Error al cambiar la contraseña:", err);
        },
      });
    } else {
      alert("Por favor, corrige los errores en el formulario.");
    }
  }

  getPasswordFieldError(field: string): string | null {
    const control = this.passwordForm.get(field);
    if (control?.touched && control.invalid) {
      if (control.hasError("required")) return "Este campo es obligatorio.";
      if (control.hasError("minlength"))
        return "La contraseña debe tener al menos 6 caracteres.";
    }
    return null;
  }
}
