import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService, CartItem } from '../../core/services/cart.service';
import { FormsModule } from '@angular/forms';
import { QuantityControlComponent } from '../../shared/components/quantity-control/quantity-control.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, QuantityControlComponent, FormsModule],
  providers: [CurrencyPipe],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  private fallbackImage = 'assets/placeholder.png';
  fullName = '';
  address = '';
  fullNameError = false;
  addressError = false;

  constructor(public cartService: CartService, private http: HttpClient) {}

  validateFullName() {
    this.fullNameError = !this.fullName.trim();
  }

  validateAddress() {
    this.addressError = !this.address.trim();
  }

  calculateTotal(items: any[]): number {
    return items.reduce((total, item) => total + (item.precio * item.cartQuantity), 0);
  }

  getItemImage(item: any): string {
    return item.imagenes?.length > 0 ? item.imagenes[0].imagen : this.fallbackImage;
  }

  onImageError(event: any) {
    event.target.src = this.fallbackImage;
  }

  updateQuantity(productId: number, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }

  async sendOrder(items: any[]) {
    this.validateFullName();
    this.validateAddress();

    if (this.fullNameError || this.addressError) {
      return;
    }

    const codigoRef = localStorage.getItem('codigo_ref');
    let referred = '';

    if (codigoRef) {
      referred = await this.http
        .get<{ nombre: string }>(`${environment.apiUrl}/afiliados/codigo/${codigoRef}`)
        .toPromise()
        .then((response) => response?.nombre || ' -')
        .catch(() => ' -');
    }

    const orderDetails = items
      .map((item) =>
        `* ${item.nombre} (Cantidad: ${item.cartQuantity}${
          item.selectedTalla ? `, Talla: ${item.selectedTalla}` : ''
        })`
      )
      .join('\n');

    const total = this.calculateTotal(items);

    const message = `
  Mi pedido:\n${orderDetails}
Total: ${total}$
Nombre: ${this.fullName}
Dirección: ${this.address}
Referido: ${referred}
`.trim();

    const whatsappURL = `https://wa.me/${environment.wanumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  }
}
