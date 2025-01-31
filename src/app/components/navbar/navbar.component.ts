import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CartService } from "../../core/services/cart.service";
import { CommonModule } from "@angular/common";
import { SearchBarComponent } from "../search-bar/search-bar.component";
import { CartSidebarComponent } from "../cart-sidebar/cart-sidebar.component";
import { SesionSidebarComponent } from "../sesion-sidebar/sesion-sidebar.component";
import { map } from "rxjs/operators";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    SearchBarComponent,
    CartSidebarComponent,
    SesionSidebarComponent,
  ],
  templateUrl: "./navbar.component.html",
})
export class NavbarComponent {
  isMenuOpen = false;
  sesionActive$ = this.authService.currentUser$.pipe(map((user) => !!user));
  cartItemCount$ = this.cartService
    .getItems()
    .pipe(
      map((items) =>
        items.reduce((total, item) => total + item.cartQuantity, 0)
      )
    );

  constructor(
    public cartService: CartService,
    private authService: AuthService
  ) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
