import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-quantity-control",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./quantity-control.component.html",
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
