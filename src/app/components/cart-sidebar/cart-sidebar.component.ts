import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { CartService } from "../../core/services/cart.service";
import { QuantityControlComponent } from "../../shared/components/quantity-control/quantity-control.component";

@Component({
  selector: "app-cart-sidebar",
  standalone: true,
  imports: [CommonModule, RouterLink, QuantityControlComponent],
  templateUrl: "./cart-sidebar.component.html",
})
export class CartSidebarComponent {
  isOpen = false;
  private fallbackImage = "assets/placeholder.png";

  constructor(public cartService: CartService) {}

  calculateTotal(items: any[]): number {
    return items.reduce(
      (total, item) => total + item.precio * item.cartQuantity,
      0
    );
  }

  getItemImage(item: any): string {
    return item.imagenes?.length > 0
      ? item.imagenes[0].imagen
      : this.fallbackImage;
  }

  onImageError(event: any) {
    event.target.src = this.fallbackImage;
  }

  updateQuantity(productId: number, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }

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
}
