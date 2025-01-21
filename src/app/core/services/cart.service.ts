import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';

export interface CartItem extends Product {
  cartQuantity: number;
  selectedTalla?: string; // Talla seleccionada por el usuario
  tallaError?: boolean;   // Error de validación relacionado con la talla
}


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items = new BehaviorSubject<CartItem[]>([]);

  getItems(): Observable<CartItem[]> {
    return this.items.asObservable();
  }

  addToCart(product: Product) {
    const currentItems = this.items.value;
    const existingItem = currentItems.find(item => item.idproducto === product.idproducto);
  
    if (existingItem) {
      if (existingItem.cartQuantity < existingItem.cantidad) {
        this.updateQuantity(product.idproducto, existingItem.cartQuantity + 1);
      }
    } else {
      this.items.next([
        ...currentItems,
        {
          ...product,
          cartQuantity: 1,
          selectedTalla: '', // Inicializado vacío
          tallaError: false  // Sin error inicialmente
        }
      ]);
    }
  }
  

  updateQuantity(productId: number, quantity: number) {
    const currentItems = this.items.value;
    const item = currentItems.find(item => item.idproducto === productId);
  
    if (item && quantity > 0 && quantity <= item.cantidad) {
      const updatedItems = currentItems.map(item =>
        item.idproducto === productId
          ? { ...item, cartQuantity: quantity } // Preserva las propiedades existentes
          : item
      );
      this.items.next(updatedItems);
    }
  }
  

  removeFromCart(productId: number) {
    const currentItems = this.items.value;
    this.items.next(currentItems.filter(item => item.idproducto !== productId));
  }
}