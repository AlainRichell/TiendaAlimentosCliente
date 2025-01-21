import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-center items-center space-x-2 mt-8">
      <button
        (click)="onPageChange(currentPage - 1)"
        [disabled]="currentPage === 1"
        class="px-3 py-1 rounded-md bg-primary text-white font-montserrat"
        [class.opacity-50]="currentPage === 1">
        Previous
      </button>
      
      <span class="font-montserrat">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      
      <button
        (click)="onPageChange(currentPage + 1)"
        [disabled]="currentPage === totalPages"
        class="px-3 py-1 rounded-md bg-primary text-white font-montserrat"
        [class.opacity-50]="currentPage === totalPages">
        Next
      </button>
    </div>
  `
})
export class PaginationComponent {
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() currentPage: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}