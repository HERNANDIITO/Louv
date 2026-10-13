import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpContext } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { USE_AUTH } from "../context/auth.context";
import { NewOrder } from "../interfaces/order.interface";
import { FORCE_JSON } from "../context/json.context";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  http = inject(HttpClient);

  constructor() {}

  getMyOrders() {
    return this.http.get<any>(`${environment.apiUrl}/users/me/orders`, {
      withCredentials: true,
      context: new HttpContext().set(USE_AUTH, true),
    });
  }

  getOrders(query: Record<string, any>) {
    return this.http.get<any>(`${environment.apiUrl}/orders`, {
      withCredentials: true,
      context: new HttpContext().set(USE_AUTH, true),
      params: query,
    });
  }
  getOrderJewelPhotoUrl(orderId: string, productId: string) {
    return `${environment.apiUrl}/users/me/orders/${orderId}/${productId}/photo`;
  }

  postOrder(jewelID: string) {
    return this.http.post(`${environment.apiUrl}/orders`, 
      {
        products: [jewelID]
      },
      {
        withCredentials: true,
        context: new HttpContext().set(USE_AUTH, true).set(FORCE_JSON, true),
      }
    );
  }
}
