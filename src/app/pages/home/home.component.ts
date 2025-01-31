import { Component } from "@angular/core";
import { RouterLink, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { CategoryService } from "../../core/services/category.service";
import { ProductService } from "../../core/services/product.service";
import { map } from "rxjs/operators";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: "./home.component.html",
})
export class HomeComponent {
  categories$ = this.categoryService.getCategories().pipe(
    map((categories) => categories.slice(0, 4)) // Limitar a 4 categorías
  );

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router
  ) {}

  getCategoryImage(category: any): string {
    return category.imagenes && category.imagenes.length > 0
      ? category.imagenes[0].imagen
      : "Sin imagen";
  }

  navigateToCategory(categoryId: number) {
    this.productService.setCategoryFilter(categoryId);
    this.router.navigate(["/products"]);
  }
}
