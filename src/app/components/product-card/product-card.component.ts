import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-md overflow-hidden group relative">
  <div class="relative">
    <img 
      [src]="getMainImage()" 
      [alt]="product.nombre" 
      class="w-full h-48 object-cover"
      (error)="onImageError($event)">
    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
  </div>
  <div class="p-4">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-gobold mb-2">{{ product.nombre }}</h3>
    </div>

    <!-- Descripción con funcionalidad de expansión -->
    <div 
      class="relative"
      [ngClass]="{ 'h-12 overflow-hidden': !isDescriptionExpanded }"
      (click)="toggleDescription()"
    >
      <p class="text-gray-600 text-sm mb-2 font-montserrat cursor-pointer">{{ product.descripcion }}</p>
      <div 
        *ngIf="!isDescriptionExpanded"
        class="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white pointer-events-none">
      </div>
    </div>

    <div class="flex justify-between items-center">
      <span class="text-lg font-bold text-primary font-montserrat">{{ product.precio | currency }}</span>
      <button 
        (click)="addToCart()"
        [disabled]="product.cantidad === 0"
        class="btn btn-primary text-sm font-montserrat"
        [class.opacity-50]="product.cantidad === 0">
        {{ product.cantidad === 0 ? 'Agotado' : 'Añadir' }}
      </button>
    </div>
  </div>
  <div 
    *ngIf="showAddedNotification"
    class="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm animate-fade-out font-montserrat">
    ¡Añadido al carrito!
  </div>
</div>

  `
})
export class ProductCardComponent {
  @Input() product!: Product;
  showAddedNotification = false;
  private fallbackImage = 'assets/images/placeholder.jpg';
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