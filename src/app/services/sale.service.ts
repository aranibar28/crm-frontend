import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url + '/sales';
const payment_url = environment.base_url + '/payments';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { token: this.token } };
  }

  create_sale(data: any): Observable<any> {
    const url = `${base_url}/create_sale`;
    return this.http.post(url, data, this.headers);
  }

  pass_sale(id: any): Observable<any> {
    const url = `${base_url}/pass_sale/${id}`;
    return this.http.put(url, {}, this.headers);
  }

  accept_sale(id: any): Observable<any> {
    const url = `${base_url}/accept_sale/${id}`;
    return this.http.put(url, {}, this.headers);
  }

  cancel_sale(id: any): Observable<any> {
    const url = `${base_url}/cancel_sale/${id}`;
    return this.http.put(url, {}, this.headers);
  }

  read_sales_by_id(id: any): Observable<any> {
    const url = `${base_url}/read_sales_by_id/${id}`;
    return this.http.get(url, this.headers);
  }

  read_sales_today(): Observable<any> {
    const url = `${base_url}/read_sales_today`;
    return this.http.get(url, this.headers);
  }

  read_sales_dates(employee: any, from: any, to: any): Observable<any> {
    const url = `${base_url}/read_sales_dates/${employee}/${from}/${to}`;
    return this.http.get(url, this.headers);
  }

  create_inscription_payment(data: any): Observable<any> {
    const url = `${payment_url}/create_inscription_payment`;
    return this.http.post(url, data, this.headers);
  }

  read_inscription_payments(id: any): Observable<any> {
    const url = `${payment_url}/read_inscription_payments/${id}`;
    return this.http.get(url, this.headers);
  }
}
