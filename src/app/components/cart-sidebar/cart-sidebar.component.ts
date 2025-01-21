import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { QuantityControlComponent } from '../../shared/components/quantity-control/quantity-control.component';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, QuantityControlComponent],
  template: `
    <div 
      class="fixed inset-0 bg-black bg-opacity-50 z-50"
      [class.hidden]="!isOpen"
      (click)="close()">
    </div>
    <div class="fixed inset-y-0 right-0 w-96 max-w-full sm:w-80 md:w-96 bg-white shadow-lg transform transition-transform duration-300 z-50"
      [class.translate-x-0]="isOpen"
      [class.translate-x-full]="!isOpen">
      <div class="h-full flex flex-col">
        <div class="p-4 border-b flex justify-between items-center bg-primary text-white">
          <h2 class="text-xl font-montserrat font-semibold">Mis compras</h2>
          <button (click)="close()" class="hover:text-accent">
            <span class="material-icons">close</span>
          </button>
        </div>
        
        <div class="flex-1 overflow-y-auto p-4">
          <ng-container *ngIf="cartService.getItems() | async as items">
            <div *ngIf="items.length === 0" class="text-center py-8">
              <p class="text-gray-600 font-montserrat">Añade algo al carrito</p>
            </div>

            <div *ngIf="items.length > 0" class="space-y-4">
              <div *ngFor="let item of items" class="flex items-center space-x-4 border-b pb-4">
                <img 
                  [src]="getItemImage(item)" 
                  [alt]="item.nombre" 
                  class="w-16 h-16 object-cover rounded"
                  (error)="onImageError($event)">
                <div class="flex-1">
                  <h3 class="font-gobold">{{ item.nombre }}</h3>
                  <p class="font-montserrat text-gray-600">{{ item.precio | currency }}</p>
                  <app-quantity-control
                    [quantity]="item.cartQuantity"
                    [max]="item.cantidad"
                    (quantityChange)="updateQuantity(item.idproducto, $event)">
                  </app-quantity-control>
                </div>
                <button 
                  (click)="cartService.removeFromCart(item.idproducto)"
                  class="text-red-500 hover:text-red-700">
                  <span class="material-icons">delete</span>
                </button>
              </div>
            </div>
          </ng-container>
        </div>
        
        <div class="p-4 border-t bg-background">
          <ng-container *ngIf="cartService.getItems() | async as items">
            <div class="flex justify-between items-center mb-4">
              <span class="text-lg font-gobold">Total:</span>
              <span class="text-lg font-gobold">{{ calculateTotal(items) | currency }}</span>
            </div>
            <a 
              routerLink="/cart" 
              (click)="close()"
              class="btn btn-primary w-full text-center font-montserrat">
              Comprar
            </a>
          </ng-container>
        </div>
      </div>
    </div>
  `
})
export class CartSidebarComponent {
  isOpen = false;
  private fallbackImage = 'assets/images/placeholder.jpg';

  constructor(public cartService: CartService) {}

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

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }
}