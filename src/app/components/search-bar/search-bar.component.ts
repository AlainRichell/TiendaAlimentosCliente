import { Component, OnDestroy, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ProductService } from "../../core/services/product.service";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-search-bar",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./search-bar.component.html",
})
export class SearchBarComponent implements OnDestroy {
  searchTerm = "";
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  @Output() search = new EventEmitter<string>();

  constructor(private router: Router, private productService: ProductService) {
    this.setupSearchSubscription();
  }

  private setupSearchSubscription() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((term) => {
        this.productService.setSearchFilter(term);
      });
  }

  onSearchChange(term: string) {
    this.searchSubject.next(term);
  }

  onSearch() {
    this.productService.setSearchFilter(this.searchTerm.trim());
    this.search.emit();
    if (!this.router.url.includes("/products")) {
      this.router.navigate(["/products"]);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
