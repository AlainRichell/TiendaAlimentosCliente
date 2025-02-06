import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-sesion-sidebar",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./sesion-sidebar.component.html",
})
export class SesionSidebarComponent {
  isOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  open() {
    this.isOpen = true;
    this.disableBodyScroll();
  }

  close() {
    this.isOpen = false;
    this.enableBodyScroll();
  }

  toggle() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.disableBodyScroll();
    } else {
      this.enableBodyScroll();
    }
  }

  private disableBodyScroll() {
    document.body.style.overflow = "hidden";
  }

  private enableBodyScroll() {
    document.body.style.overflow = "";
  }

  logout() {
    this.authService.logout();
    this.close();
    this.router.navigate(["/"]);
  }
}
