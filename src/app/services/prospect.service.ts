import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url + '/prospects';

@Injectable({
  providedIn: 'root',
})
export class ProspectService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { token: this.token } };
  }

  create_call(data: any): Observable<any> {
    const url = `${base_url}/create_call`;
    return this.http.post(url, data, this.headers);
  }

  read_calls(id: any): Observable<any> {
    const url = `${base_url}/read_calls/${id}`;
    return this.http.get(url, this.headers);
  }

  delete_call(id: any): Observable<any> {
    const url = `${base_url}/delete_call/${id}`;
    return this.http.delete(url, this.headers);
  }

  create_mail(data: any): Observable<any> {
    const url = `${base_url}/create_mail`;
    return this.http.post(url, data, this.headers);
  }

  read_mails(id: any): Observable<any> {
    const url = `${base_url}/read_mails/${id}`;
    return this.http.get(url, this.headers);
  }

  delete_mail(id: any): Observable<any> {
    const url = `${base_url}/delete_mail/${id}`;
    return this.http.delete(url, this.headers);
  }

  create_task(data: any): Observable<any> {
    const url = `${base_url}/create_task`;
    return this.http.post(url, data, this.headers);
  }

  read_tasks(id: any): Observable<any> {
    const url = `${base_url}/read_tasks/${id}`;
    return this.http.get(url, this.headers);
  }

  delete_task(id: any): Observable<any> {
    const url = `${base_url}/delete_task/${id}`;
    return this.http.delete(url, this.headers);
  }

  make_task(id: any): Observable<any> {
    const url = `${base_url}/make_task/${id}`;
    return this.http.put(url, {}, this.headers);
  }

  list_activities(id: any): Observable<any> {
    const url = `${base_url}/list_activities/${id}`;
    return this.http.get(url, this.headers);
  }

  kpis_prospect(id: any): Observable<any> {
    const url = `${base_url}/kpis_prospect/${id}`;
    return this.http.get(url, this.headers);
  }
}
