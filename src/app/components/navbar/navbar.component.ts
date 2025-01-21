import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { CartSidebarComponent } from '../cart-sidebar/cart-sidebar.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, SearchBarComponent, CartSidebarComponent],
  template: `
    <nav class="bg-white shadow-lg fixed w-full top-0 z-40">
      <div class="container-custom">
        <div class="flex justify-between items-center h-16">
        <a routerLink="/">
          <img src="assets/logo.png" alt="VStore Logo" class="h-10 w-auto">
        </a>
          
          <div class="hidden md:block flex-1 max-w-md mx-8">
            <app-search-bar></app-search-bar>
          </div>
          
          <div class="flex items-center space-x-6">
            <div class="hidden md:flex items-center space-x-4">
              <a routerLink="/" routerLinkActive="text-primary" [routerLinkActiveOptions]="{exact: true}" 
                class="hover:text-primary font-montserrat">Inicio</a>
              <a routerLink="/products" routerLinkActive="text-primary" 
                class="hover:text-primary font-montserrat">Productos</a>
              <a routerLink="/about" routerLinkActive="text-primary" 
                class="hover:text-primary font-montserrat">Nosotros</a>
              <a routerLink="/contact" routerLinkActive="text-primary" 
                class="hover:text-primary font-montserrat">Contacto</a>
            </div>
            
            <button 
              (click)="cartSidebar.toggle()" 
              class="relative">
              <span class="material-icons text-primary">shopping_cart</span>
              <span 
                *ngIf="cartItemCount$ | async"
                class="absolute -top-2 -right-2 bg-alt text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-montserrat">
                {{ cartItemCount$ | async }}
              </span>
            </button>

            <button class="md:hidden" (click)="toggleMenu()">
              <span class="material-icons text-primary">menu</span>
            </button>
          </div>
        </div>

        <!-- Mobile menu -->
        <div class="md:hidden" [class.hidden]="!isMenuOpen">
          <div class="px-2 pt-2 pb-3 space-y-1">
            <div class="p-2">
              <app-search-bar (search)="toggleMenu()"></app-search-bar>
            </div>
            <a routerLink="/" (click)="toggleMenu()" class="block px-3 py-2 hover:text-primary font-montserrat">Inicio</a>
            <a routerLink="/products" (click)="toggleMenu()" class="block px-3 py-2 hover:text-primary font-montserrat">Productos</a>
            <a routerLink="/about" (click)="toggleMenu()" class="block px-3 py-2 hover:text-primary font-montserrat">Nosotros</a>
            <a routerLink="/contact" (click)="toggleMenu()" class="block px-3 py-2 hover:text-primary font-montserrat">Contacto</a>
          </div>
        </div>
      </div>
    </nav>

    <app-cart-sidebar #cartSidebar></app-cart-sidebar>
  `
})
export class NavbarComponent {
  isMenuOpen = false;
  cartItemCount$ = this.cartService.getItems().pipe(
    map(items => items.reduce((total, item) => total + item.cartQuantity, 0))
  );
  
  constructor(public cartService: CartService) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}