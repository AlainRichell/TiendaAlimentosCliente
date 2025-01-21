import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Category } from '../models/category.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categories$ = new BehaviorSubject<Category[]>([]);
  private loading$ = new BehaviorSubject<boolean>(false);

  constructor(private apiService: ApiService) {
    this.loadCategories();
  }

  private loadCategories() {
    this.loading$.next(true);
    this.apiService.getCategories().pipe(
      tap(categories => {
        this.categories$.next(categories);
        this.loading$.next(false);
      })
    ).subscribe();
  }

  getCategories(): Observable<Category[]> {
    return this.categories$.asObservable();
  }

  isLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  refreshCategories() {
    this.loadCategories();
  }
}