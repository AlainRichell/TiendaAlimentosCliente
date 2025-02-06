import { Component, OnDestroy, HostListener } from "@angular/core";
import { Router, NavigationStart } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { environment } from "../../../environments/environment";
import { CommonModule } from "@angular/common";
import { CartService } from "../../core/services/cart.service";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class CheckoutComponent implements OnDestroy {
  paymentForm: FormGroup;
  loading = false;
  error: string | null = null;
  items: any[] = [];
  total: number = 0;
  currentUser: any;
  private navigationSubscription: Subscription;
  private purchaseCompleted = false;
  private reservationCancelled = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
    private cartService: CartService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.items = navigation?.extras.state?.["items"] || [];
    this.total = this.calculateTotal(this.items);
    this.currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

    this.paymentForm = this.fb.group({
      paymentMethod: ["cash", Validators.required],
      transferReference: [""],
    });

    this.navigationSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: any) => {
        this.cancelReservation();
      });
  }

  // Método para prevenir la selección de Transfermovil
  preventTransferSelection(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    // Opcional: mostrar un mensaje informativo
    console.log("La opción de Transfermovil está deshabilitada.");
  }

  // Añadir este método para manejar el cierre de pestaña/navegador
  @HostListener("window:beforeunload", ["$event"])
  handleBeforeUnload(event: BeforeUnloadEvent) {
    this.cancelReservation();
    this.router.navigate(["/cart"]);
  }

  ngOnDestroy() {
    this.cancelReservation();
    this.navigationSubscription.unsubscribe();
  }

  private cancelReservation() {
    if (
      this.items.length > 0 &&
      !this.purchaseCompleted &&
      !this.reservationCancelled
    ) {
      const itemsCancel = this.items.map((item) => ({
        idproducto: item.idproducto, // Mapear idproducto
        cantidad: item.cartQuantity, // Mapear cantidad
      }));

      console.log("Items a cancelar: ", itemsCancel);
      this.reservationCancelled = true;

      this.http
        .post(`${environment.apiUrl}/reservas/cancelar/`, {
          items: itemsCancel,
        })
        .subscribe({
          next: () => console.log("Reserva cancelada exitosamente"),
          error: (err) => console.error("Error al cancelar la reserva", err),
        });
    }
  }

  calculateTotal(items: any[]): number {
    return items.reduce(
      (total, item) => total + item.precio * item.cartQuantity,
      0
    );
  }

  get paymentMethod() {
    return this.paymentForm.get("paymentMethod");
  }

  async submitOrder() {
    this.loading = true;
    this.error = null;

    try {
      // 1. Confirmar la compra
      const itemsConfirm = this.items.map((item) => ({
        producto_id: item.idproducto, // Mapear idproducto
        cantidad: item.cartQuantity, // Mapear cantidad
      }));

      const confirmResponse: any = await this.http
        .post(`${environment.apiUrl}/reservas/confirmar/`, {
          items: itemsConfirm,
        })
        .toPromise();

      // 2. Crear transacción
      const transactionData = {
        idusuario: this.currentUser.user_id,
        monto: this.total,
        moneda: "CUP",
        hora: new Date().toTimeString().split(" ")[0],
        fecha: new Date().toISOString().split("T")[0],
        idtipotransaccion:
          this.paymentForm.value.paymentMethod === "cash" ? 1 : 2,
        pagodirecto: this.paymentForm.value.paymentMethod === "cash",
        codigoreferencia:
          this.paymentForm.value.paymentMethod === "transfer"
            ? this.paymentForm.value.transferReference
            : null,
      };

      const transaction: any = await this.http
        .post(`${environment.apiUrl}/transacciones/`, transactionData)
        .toPromise();

      const orderData = {
        idusuario: this.currentUser.user_id,
        idtipopedido: 1,
        fecha: new Date().toISOString().split("T")[0],
        productos: this.items.map((item) => ({
          producto_id: item.idproducto, // Campo correcto
          cantidad: item.cartQuantity,
        })),
        transacciones: [transaction.idtransaccion],
      };

      const order: any = await this.http
        .post(
          `${environment.apiUrl}/user/${this.currentUser.user_id}/pedidos/`,
          orderData
        )
        .toPromise();

      this.cartService.clearCart();
      this.purchaseCompleted = true;

      alert(
        "¡Compra realizada con éxito! Para ver su pedido diríjase a la opción de pedidos en su cuenta."
      );

      this.router.navigate(["/products"]);
    } catch (error: any) {
      this.error = "Error al procesar el pedido. Intente nuevamente.";
      console.error("Error:", error);
    } finally {
      this.loading = false;
    }
  }

  // Simulación de pago con Transfermovil
  simulateTransferPayment() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, reference: "TRF-123456" });
      }, 2000);
    });
  }
}
