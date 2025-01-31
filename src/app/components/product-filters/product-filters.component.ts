import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ProductService } from "../../core/services/product.service";
import { CategoryService } from "../../core/services/category.service";

@Component({
  selector: "app-product-filters",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./product-filters.component.html",
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
