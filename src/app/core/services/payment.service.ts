import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  async createEnzonaPayment(order: Partial<Order>): Promise<string> {
    const response = await firstValueFrom(
      this.http.post<{ paymentUrl: string }>(
        `${environment.apiUrl}/payments/enzona`,
        order
      )
    );
    return response.paymentUrl;
  }

  async createTransfermovilPayment(order: Partial<Order>): Promise<string> {
    const response = await firstValueFrom(
      this.http.post<{ paymentUrl: string }>(
        `${environment.apiUrl}/payments/transfermovil`,
        order
      )
    );
    return response.paymentUrl;
  }

  async verifyPayment(orderId: number, provider: 'enzona' | 'transfermovil'): Promise<boolean> {
    const response = await firstValueFrom(
      this.http.get<{ verified: boolean }>(
        `${environment.apiUrl}/payments/${provider}/verify/${orderId}`
      )
    );
    return response.verified;
  }
}