import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url + '/kpis';

@Injectable({
  providedIn: 'root',
})
export class KpisService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { token: this.token } };
  }

  kpi_month_payments(): Observable<any> {
    const url = `${base_url}/kpi_month_payments`;
    return this.http.get(url, this.headers);
  }

  kpi_month_type(year: any, month: any): Observable<any> {
    const url = `${base_url}/kpi_month_type/${year}/${month}`;
    return this.http.get(url, this.headers);
  }

  kpi_month_method(year: any, month: any): Observable<any> {
    const url = `${base_url}/kpi_month_method/${year}/${month}`;
    return this.http.get(url, this.headers);
  }

  kpi_course_earnings(year: any, month: any): Observable<any> {
    const url = `${base_url}/kpi_course_earnings/${year}/${month}`;
    return this.http.get(url, this.headers);
  }

  kpi_product_earnings(year: any, month: any): Observable<any> {
    const url = `${base_url}/kpi_product_earnings/${year}/${month}`;
    return this.http.get(url, this.headers);
  }

  kpi_month_prospects(): Observable<any> {
    const url = `${base_url}/kpi_month_prospects`;
    return this.http.get(url, this.headers);
  }

  kpi_genre_prospects(): Observable<any> {
    const url = `${base_url}/kpi_genre_prospects`;
    return this.http.get(url, this.headers);
  }

  kpi_top_customers(): Observable<any> {
    const url = `${base_url}/kpi_top_customers`;
    return this.http.get(url, this.headers);
  }

  kpi_top_products(): Observable<any> {
    const url = `${base_url}/kpi_top_products`;
    return this.http.get(url, this.headers);
  }

  kpi_top_courses(): Observable<any> {
    const url = `${base_url}/kpi_top_courses`;
    return this.http.get(url, this.headers);
  }
}
