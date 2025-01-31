import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { Product } from "../../core/models/product.model";
import { CartService } from "../../core/services/cart.service";

@Component({
  selector: "app-product-card",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./product-card.component.html",
})
export class ProductCardComponent {
  @Input() product!: Product;
  showAddedNotification = false;
  private fallbackImage = "assets/placeholder.png";
  isDescriptionExpanded = false;

  constructor(private cartService: CartService) {}

  getMainImage(): string {
    return this.product.imagenes?.length > 0
      ? this.product.imagenes[0].imagen
      : this.fallbackImage;
  }

  toggleDescription() {
    this.isDescriptionExpanded = !this.isDescriptionExpanded;
  }

  onImageError(event: any) {
    event.target.src = this.fallbackImage;
  }

  addToCart() {
    if (this.product.cantidad > 0) {
      this.cartService.addToCart(this.product);
      this.showAddedNotification = true;
      setTimeout(() => {
        this.showAddedNotification = false;
      }, 2000);
    }
  }
}
