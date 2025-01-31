import { Component } from "@angular/core";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { CartService, CartItem } from "../../core/services/cart.service";
import { FormsModule } from "@angular/forms";
import { QuantityControlComponent } from "../../shared/components/quantity-control/quantity-control.component";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-cart",
  standalone: true,
  imports: [CommonModule, RouterLink, QuantityControlComponent, FormsModule],
  providers: [CurrencyPipe],
  templateUrl: "./cart.component.html",
})
export class CartComponent {
  private fallbackImage = "assets/placeholder.png";

  constructor(public cartService: CartService, private http: HttpClient) {}

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
}
