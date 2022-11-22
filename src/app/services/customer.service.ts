import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url + '/customers';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { token: this.token } };
  }

  create_customer(data: any): Observable<any> {
    const url = `${base_url}/create_customer`;
    if (data.image) {
      const fd = new FormData();
      Object.keys(data).forEach((key) => fd.append(key, data[key]));
      return this.http.post(url, fd, this.headers);
    } else {
      return this.http.post(url, data, this.headers);
    }
  }

  read_customers(filter: string): Observable<any> {
    if (!filter) filter = 'all';
    const url = `${base_url}/read_customers/${filter}`;
    return this.http.get(url, this.headers);
  }

  read_customer_by_id(id: any): Observable<any> {
    const url = `${base_url}/read_customer_by_id/${id}`;
    return this.http.get(url, this.headers);
  }

  update_customer(id: any, data: any): Observable<any> {
    const url = `${base_url}/update_customer/${id}`;
    if (data.image) {
      const fd = new FormData();
      Object.keys(data).forEach((key) => fd.append(key, data[key]));
      return this.http.put(url, fd, this.headers);
    } else {
      return this.http.put(url, data, this.headers);
    }
  }

  delete_customer(id: any): Observable<any> {
    const url = `${base_url}/delete_customer/${id}`;
    return this.http.delete(url, this.headers);
  }

  change_status(id: any, data: any): Observable<any> {
    const url = `${base_url}/change_status/${id}`;
    return this.http.put(url, data, this.headers);
  }
}
