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
  template: `
    <div class="pt-16 container-custom py-8">
      <h1 class="text-3xl font-bold mb-8 mt-8">Carrito de compras</h1>

      <div class="bg-white rounded-lg shadow-md p-6">
        <ng-container *ngIf="cartService.getItems() | async as items">
          <!-- Mensaje cuando el carrito está vacío -->
          <div *ngIf="items.length === 0" class="text-center py-8">
            <p class="text-gray-600 mb-4 font-montserrat">Añade algo al carrito</p>
            <a routerLink="/products" class="btn btn-primary font-montserrat">Seguir comprando</a>
          </div>

          <!-- Lista de productos -->
          <ng-container *ngIf="items.length > 0">
            <div class="space-y-4">
              <p class="text-lg font-gobold mb-4"> Listado de productos seleccionados:</p>
              <div class="border-b pb-2"></div>
              <div *ngFor="let item of items; let i = index" class="border-b pb-4">
                <div class="flex items-center space-x-4 justify-between">
                  <!-- Imagen -->
                  <img 
                    [src]="getItemImage(item)" 
                    [alt]="item.nombre" 
                    class="w-16 h-16 object-cover rounded"
                    (error)="onImageError($event)">
                  
                  <!-- Información del producto -->
                  <div class="flex-1">
                    <h3 class="font-gobold">{{ item.nombre }}</h3>
                    <p class="text-gray-600 font-montserrat">Precio: {{ item.precio | currency }}</p>
                    <app-quantity-control
                      [quantity]="item.cartQuantity"
                      [max]="item.cantidad"
                      (quantityChange)="updateQuantity(item.idproducto, $event)">
                    </app-quantity-control>
                  </div>

                  <!-- Botón de eliminar -->
                  <button 
                    (click)="cartService.removeFromCart(item.idproducto)"
                    class="ml-auto text-red-500 hover:text-red-700">
                    <span class="material-icons mr-8">delete</span>
                  </button>
                </div>

              </div>
            </div>

            <!-- Inputs de dirección -->
            <div class="mt-4">
              <p class="text-lg font-gobold mb-4"> Su datos:</p>
              <form (ngSubmit)="sendOrder(items)" class="space-y-4">
                <div>
                  <input 
                    [(ngModel)]="fullName" 
                    name="fullName" 
                    placeholder="Nombre completo" 
                    class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50 {{ fullNameError ? 'border-red-500' : 'border-gray-300' }}" 
                    (blur)="validateFullName()" 
                    required>
                  <p *ngIf="fullNameError" class="text-red-500 text-sm mt-1">Su nombre es requerido.</p>
                </div>

                <div>
                  <input 
                    [(ngModel)]="address" 
                    name="address" 
                    placeholder="Dirección" 
                    class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50 {{ addressError ? 'border-red-500' : 'border-gray-300' }}" 
                    (blur)="validateAddress()" 
                    required>
                  <p *ngIf="addressError" class="text-red-500 text-sm mt-1">La dirección es requerida.</p>
                </div>

                <p class="text-lg font-gobold text-red-700"> *Forma de pago:</p>
                <p class="text-red-600 ">
                  Los pagos se realizan en USD, EURO o MN al cambio (Zelle - Transferencia MN).
                  Se debe pagar la primera mitad del costo del producto para realizar el encargo.
                </p>

                <div class="flex justify-between items-center">
                  <div class="text-lg font-gobold">
                    Total: {{ calculateTotal(items) | currency }}
                  </div>
                  <button class="btn btn-primary font-montserrat">
                    Hacer el pedido
                  </button>
                </div>
              </form>
            </div>
          </ng-container>
        </ng-container>
      </div>
    </div>
  `
})
export class CartComponent {
  private fallbackImage = 'assets/images/placeholder.jpg';
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
