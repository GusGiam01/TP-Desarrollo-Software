import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface CreatePreferenceResponse {
  preferenceId: string;
  initPoint: string;
}

@Injectable({ providedIn: "root" })
export class MercadopagoService {
  constructor(private http: HttpClient) {}

  createPreference(orderId: string): Observable<CreatePreferenceResponse> {
    return this.http.post<CreatePreferenceResponse>(
      "/api/mercadopago/preference",
      { orderId }
    );
  }
}
