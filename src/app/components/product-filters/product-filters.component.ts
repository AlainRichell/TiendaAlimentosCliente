import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white p-4 rounded-lg shadow-md">
      <h3 class="text-lg font-bold mb-4">Filtros</h3>
      
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
        <select 
          (change)="onCategoryChange($event)"
          class="w-full border rounded-md p-2">
          <option value="">Todo</option>
          <option 
            *ngFor="let category of categories$ | async"
            [value]="category.idcategoria">
            {{ category.categoria }}
          </option>
        </select>
      </div>
    </div>
  `
})
export class ProductFiltersComponent implements OnInit {
  categories$ = this.categoryService.getCategories();

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {}

  onCategoryChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const categoryId = select.value ? parseInt(select.value, 10) : null;
    this.productService.setCategoryFilter(categoryId);
  }

}
