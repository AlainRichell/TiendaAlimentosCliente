import { Component, OnInit } from "@angular/core";
import { PedidoService } from "../../core/services/pedido.service";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-pedido-list",
  templateUrl: "./pedido-list.component.html",
  standalone: true,
  imports: [CommonModule],
})
export class PedidoListComponent implements OnInit {
  pedidos: any[] = [];
  currentUser: any;
  tipoPedidoMap: { [key: number]: string } = {};

  constructor(private pedidoService: PedidoService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTipoPedidos();

    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      this.currentUser = JSON.parse(currentUser);
      if (this.currentUser?.user_id) {
        this.loadPedidos(this.currentUser.user_id);
      }
    }
  }

  loadTipoPedidos(): void {
    this.http.get<any[]>(`${environment.apiUrl}/tipo-pedidos/`).subscribe({
      next: (data) => {
        this.tipoPedidoMap = data.reduce((acc, tipo) => {
          acc[tipo.idtipopedido] = tipo.tipopedido;
          return acc;
        }, {});
      },
      error: (error) => console.error("Error cargando tipos de pedido:", error),
    });
  }

  // En pedido-list.component.ts
  loadPedidos(userId: number): void {
    this.pedidoService.getPedidosByUser(userId).subscribe({
      next: (data: any) => {
        this.pedidos = data.map((pedido: any) => ({
          ...pedido,
          fecha: new Date(pedido.fecha),
          pedido_productos: pedido.productos, // Mapear la respuesta del API
        }));
      },
      error: (error) => console.error("Error cargando pedidos:", error),
    });
  }

  getEstadoPedido(idtipopedido: number): string {
    return this.tipoPedidoMap[idtipopedido] || "Desconocido";
  }

  cancelPedido(pedidoId: number): void {
    if (confirm("¿Estás seguro de que deseas cancelar este pedido?")) {
      this.pedidoService
        .cancelPedido(this.currentUser.user_id, pedidoId)
        .subscribe({
          next: () => {
            // Actualizar localmente el estado en lugar de recargar toda la lista
            const pedido = this.pedidos.find((p) => p.idpedido === pedidoId);
            if (pedido) {
              pedido.idtipopedido = 4;
              pedido.estado = this.getEstadoPedido(4); // Actualizar el texto del estado
            }
          },
          error: (error) => {
            console.error("Error cancelando pedido:", error);
            // Opcional: Mostrar mensaje de error al usuario
          },
        });
    }
  }

  generateFactura(pedidoId: number): void {
    this.pedidoService.generateFactura(pedidoId).subscribe({
      next: (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement("a");
        a.href = url;
        a.download = `factura_${pedidoId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => console.error("Error generando factura:", error),
    });
  }

  getEstadoIcon(idtipopedido: number): string {
    const estado = this.getEstadoPedido(idtipopedido);
    switch (estado) {
      case "Entregado":
        return "check_circle";
      case "Pendiente":
        return "schedule";
      case "Cancelado":
        return "cancel";
      case "Enviado":
        return "local_shipping";
      default:
        return "info";
    }
  }
}

interface Pedido {
  idpedido: number;
  idusuario: number;
  idtipopedido: number;
  fecha: Date;
  pedido_productos: {
    producto_id: number;
    producto_nombre: string; // Nuevo campo
    cantidad: number;
  }[];
  transacciones: number[];
  estado?: string;
}
