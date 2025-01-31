import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProductCardComponent } from "../../components/product-card/product-card.component";
import { ProductFiltersComponent } from "../../components/product-filters/product-filters.component";
import { ProductService } from "../../core/services/product.service";
import { Observable } from "rxjs";
import { Product } from "../../core/models/product.model";

@Component({
  selector: "app-products",
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ProductFiltersComponent],
  templateUrl: "./products.component.html",
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
