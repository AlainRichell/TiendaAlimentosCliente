import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  // Obtener token desde localStorage
  private getAuthHeaders(): HttpHeaders {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const token = currentUser?.token || "";
    return new HttpHeaders({
      Authorization: `token ${token}`,
    });
  }

  // Obtener datos del usuario por ID
  getUser(userId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/${userId}`; // Agregar userId a la URL
    return this.http.get(url, { headers });
  }

  // Actualizar datos del usuario por ID
  updateUser(userId: number, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/${userId}/`; // Agregar userId a la URL
    return this.http.put(url, data, { headers });
  }

  changePassword(userId: number, newPassword: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/${userId}/change-password/`; // Endpoint para cambiar la contraseña
    const body = { new_password: newPassword }; // Datos enviados en la solicitud
    return this.http.put(url, body, { headers });
  }
}
