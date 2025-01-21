import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quantity-control',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center space-x-2">
      <button 
        (click)="decrease()"
        [disabled]="quantity <= 1"
        class="w-8 h-8 flex items-center justify-center rounded-full bg-accent text-white hover:bg-secondary"
        [class.opacity-50]="quantity <= 1">
        <span class="material-icons text-sm">remove</span>
      </button>
      
      <span class="w-8 text-center font-montserrat">{{ quantity }}</span>
      
      <button 
        (click)="increase()"
        [disabled]="quantity >= max"
        class="w-8 h-8 flex items-center justify-center rounded-full bg-accent text-white hover:bg-secondary"
        [class.opacity-50]="quantity >= max">
        <span class="material-icons text-sm">add</span>
      </button>
    </div>
  `
})
export class QuantityControlComponent {
  @Input() quantity: number = 1;
  @Input() max: number = Infinity;
  @Output() quantityChange = new EventEmitter<number>();

  decrease() {
    if (this.quantity > 1) {
      this.quantityChange.emit(this.quantity - 1);
    }
  }

  increase() {
    if (this.quantity < this.max) {
      this.quantityChange.emit(this.quantity + 1);
    }
  }
}