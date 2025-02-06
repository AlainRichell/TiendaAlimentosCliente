import { Component } from "@angular/core";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { RouterLink, Router } from "@angular/router";
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
  reservando = false;
  errorReserva: string | null = null;
  productosConError: number[] = [];

  constructor(
    public cartService: CartService,
    private http: HttpClient,
    private router: Router
  ) {}

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

  async realizarPedido() {
    this.reservando = true;
    this.errorReserva = null;
    this.productosConError = [];

    try {
      // Obtener los items del carrito
      const items = this.cartService.getItemsSnapshot().map((item) => ({
        producto_id: item.idproducto,
        cantidad: item.cartQuantity,
      }));

      // Intentar reservar los productos
      const reservaResponse: any = await this.http
        .post(`${environment.apiUrl}/reservas/reservar/`, { items })
        .toPromise();

      // Si la reserva fue exitosa, navegar al componente de checkout
      this.router.navigate(["/checkout"], {
        state: {
          items: this.cartService.getItemsSnapshot(),
          total: this.calculateTotal(items),
          fromCart: true, // Bandera importante
        },
      });
    } catch (error: any) {
      // Manejar errores de reserva
      this.manejarErrorReserva(error);
    } finally {
      this.reservando = false;
    }
  }

  private manejarErrorReserva(error: any) {
    if (error.error?.error) {
      const match = error.error.error.match(/producto ID: (\d+)/);
      if (match && match[1]) {
        const productId = parseInt(match[1]);
        this.productosConError.push(productId);
        this.errorReserva = `No hay suficiente stock para algunos productos. Ajusta las cantidades e intenta nuevamente.`;
      }
    } else {
      this.errorReserva = "Error al procesar la reserva. Intenta nuevamente.";
    }
  }

  actualizarCantidad(productId: number, quantity: number) {
    // Limpiar error si existe
    this.productosConError = this.productosConError.filter(
      (id) => id !== productId
    );
    this.cartService.updateQuantity(productId, quantity);
  }

  getItemsConEstado(items: CartItem[]): any[] {
    return items.map((item) => ({
      ...item,
      tieneError: this.productosConError.includes(item.idproducto),
    }));
  }
}
