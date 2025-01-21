import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap, finalize } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products$ = new BehaviorSubject<Product[]>([]);
  private categoryFilter$ = new BehaviorSubject<number | null>(null);
  private brandFilter$ = new BehaviorSubject<number | null>(null); // Filtro por marca
  private searchFilter$ = new BehaviorSubject<string>('');
  private loading$ = new BehaviorSubject<boolean>(false);
  private displayCount$ = new BehaviorSubject<number>(9);
  private pageSize$ = new BehaviorSubject<number>(9); // 20 es un valor inicial razonable

  constructor(private apiService: ApiService) {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading$.next(true);
    this.apiService.getProducts().pipe(
      tap(products => this.products$.next(products)),
      finalize(() => this.loading$.next(false))
    ).subscribe();
  }

  getProducts(): Observable<Product[]> {
    return this.products$.asObservable();
  }

  getFilteredProducts(): Observable<Product[]> {
    return combineLatest([
      this.products$,
      this.categoryFilter$,
      this.brandFilter$,
      this.searchFilter$
    ]).pipe(
      map(([products, category, brand, search]) => {
        return products.filter(product => {
          const matchesCategory = !category || 
            product.categorias.some(cat => cat.idcategoria === category)
          const searchTerm = search.toLowerCase().trim();
          const matchesSearch = !searchTerm || 
            product.nombre.toLowerCase().includes(searchTerm) ||
            (product.descripcion?.toLowerCase().includes(searchTerm) ?? false);
  
          return matchesCategory && matchesSearch;
        });
      })
    );
  }
  

  getDisplayedProducts(): Observable<Product[]> {
    return combineLatest([
      this.getFilteredProducts(),
      this.displayCount$
    ]).pipe(
      map(([products, count]) => {
        // Retornar solo los productos visibles según el límite actual
        return products.slice(0, count);
      })
    );
  }

  hasMoreProducts(): Observable<boolean> {
    return combineLatest([
      this.getFilteredProducts(),
      this.displayCount$
    ]).pipe(
      map(([filteredProducts, count]) => {
        // Hay más productos si el total de filtrados es mayor que el número de visibles
        return filteredProducts.length > count;
      })
    );
  }

  setPageSize(size: number): void {
    this.pageSize$.next(size);
  }

  resetDisplayCount(): void {
    this.displayCount$.next(this.pageSize$.value);
  }

  increaseDisplayCount(): void {
    const currentCount = this.displayCount$.value;
    const pageSize = this.pageSize$.value;
    this.displayCount$.next(currentCount + pageSize);
  }
  

  setCategoryFilter(categoryId: number | null): void {
    this.categoryFilter$.next(categoryId);
    this.resetDisplayCount();
  }

  setBrandFilter(brandId: number | null): void {
    this.brandFilter$.next(brandId);
    this.resetDisplayCount();
  }

  setSearchFilter(term: string): void {
    this.searchFilter$.next(term);
    this.resetDisplayCount(); // Esto asegura que se reinicie la cantidad mostrada
  }
  

  refreshProducts(): void {
    this.loadProducts();
  }

  isLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }
}
