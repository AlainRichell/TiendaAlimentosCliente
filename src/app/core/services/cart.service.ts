import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Product } from "../models/product.model";

export interface CartItem extends Product {
  cartQuantity: number;
}

@Injectable({
  providedIn: "root",
})
export class CartService {
  private items = new BehaviorSubject<CartItem[]>(this.getCartFromStorage());

  private getCartFromStorage(): CartItem[] {
    try {
      const cart = localStorage.getItem("cart");
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      return [];
    }
  }

  private saveCartToStorage(items: CartItem[]): void {
    localStorage.setItem("cart", JSON.stringify(items));
  }

  getItems(): Observable<CartItem[]> {
    return this.items.asObservable();
  }

  getItemsSnapshot(): CartItem[] {
    return this.items.value;
  }

  addToCart(product: Product) {
    const currentItems = this.items.value;
    const existingItem = currentItems.find(
      (item) => item.idproducto === product.idproducto
    );

    if (existingItem) {
      if (existingItem.cartQuantity < existingItem.cantidad) {
        this.updateQuantity(product.idproducto, existingItem.cartQuantity + 1);
      }
    } else {
      const newItems = [...currentItems, { ...product, cartQuantity: 1 }];
      this.items.next(newItems);
      this.saveCartToStorage(newItems);
    }
  }

  updateQuantity(productId: number, quantity: number) {
    const currentItems = this.items.value;
    const item = currentItems.find((item) => item.idproducto === productId);

    if (item && quantity > 0 && quantity <= item.cantidad) {
      const updatedItems = currentItems.map((item) =>
        item.idproducto === productId
          ? { ...item, cartQuantity: quantity }
          : item
      );
      this.items.next(updatedItems);
      this.saveCartToStorage(updatedItems);
    }
  }

  removeFromCart(productId: number) {
    const currentItems = this.items.value;
    const newItems = currentItems.filter(
      (item) => item.idproducto !== productId
    );
    this.items.next(newItems);
    this.saveCartToStorage(newItems);
  }

  clearCart() {
    this.items.next([]);
    localStorage.removeItem("cart");
  }
}
