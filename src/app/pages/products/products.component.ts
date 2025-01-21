import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductFiltersComponent } from '../../components/product-filters/product-filters.component';
import { ProductService } from '../../core/services/product.service';
import { Observable } from 'rxjs';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ProductFiltersComponent],
  template: `
    <div class="pt-16 container-custom py-8">
      <h1 class="text-3xl font-bold mb-8 mt-8">Nuestros productos</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="md:col-span-1">
          <app-product-filters></app-product-filters>
        </div>
        
        <div class="md:col-span-3">
          <!-- Loading Spinner -->
          <div *ngIf="loading$ | async" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>

          <!-- Productos -->
          <div *ngIf="!(loading$ | async)" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ng-container *ngFor="let product of displayedProducts$ | async">
              <app-product-card [product]="product"></app-product-card>
            </ng-container>
          </div>

          <!-- Botón "Mostrar más" -->
          <div *ngIf="hasMoreProducts$ | async" class="mt-8 text-center">
            <button 
              (click)="loadMore()"
              class="btn btn-primary font-montserrat">
              Mostrar más ...
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductsComponent implements OnInit {
  displayedProducts$!: Observable<Product[]>;
  loading$!: Observable<boolean>;
  hasMoreProducts$!: Observable<boolean>;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.displayedProducts$ = this.productService.getDisplayedProducts();
    this.loading$ = this.productService.isLoading();
    this.hasMoreProducts$ = this.productService.hasMoreProducts();
  }

  loadMore(): void {
    this.productService.increaseDisplayCount();
  }

  
}
