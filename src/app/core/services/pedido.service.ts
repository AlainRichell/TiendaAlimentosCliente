import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PedidoService {
  private apiUrl = `${environment.apiUrl}`; // Ajusta la URL de tu API

  constructor(private http: HttpClient) {}

  getPedidosByUser(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}/pedidos/`);
  }

  cancelPedido(userId: number, pedidoId: number): Observable<any> {
    // Cambiar a PATCH y enviar el nuevo estado
    return this.http.patch(
      `${this.apiUrl}/user/${userId}/pedidos/${pedidoId}/cancelar/`,
      { idtipopedido: 4 }
    );
  }

  generateFactura(pedidoId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/pedidos/${pedidoId}/generate-factura/`,
      {
        responseType: "blob", // Para manejar la descarga de archivos
      }
    );
  }
}
