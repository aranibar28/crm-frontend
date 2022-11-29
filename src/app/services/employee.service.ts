import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url + '/employees';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { token: this.token } };
  }

  create_employee(data: any): Observable<any> {
    const url = `${base_url}/create_employee`;
    if (data.image) {
      const fd = new FormData();
      Object.keys(data).forEach((key) => fd.append(key, data[key]));
      return this.http.post(url, fd, this.headers);
    } else {
      return this.http.post(url, data, this.headers);
    }
  }

  read_employees(): Observable<any> {
    const url = `${base_url}/read_employees`;
    return this.http.get(url, this.headers);
  }

  read_employee_by_id(id: any): Observable<any> {
    const url = `${base_url}/read_employee_by_id/${id}`;
    return this.http.get(url, this.headers);
  }

  update_employee(id: any, data: any): Observable<any> {
    const url = `${base_url}/update_employee/${id}`;
    if (data.image) {
      const fd = new FormData();
      Object.keys(data).forEach((key) => fd.append(key, data[key]));
      return this.http.put(url, fd, this.headers);
    } else {
      return this.http.put(url, data, this.headers);
    }
  }

  delete_employee(id: any): Observable<any> {
    const url = `${base_url}/delete_employee/${id}`;
    return this.http.delete(url, this.headers);
  }

  change_status(id: any, data: any): Observable<any> {
    const url = `${base_url}/change_status/${id}`;
    return this.http.put(url, data, this.headers);
  }

  list_advisors(): Observable<any> {
    const url = `${base_url}/read_employees`;
    return this.http.get(url, this.headers).pipe(
      map(({ data }: any) =>
        data.filter(({ role, status }: any) => {
          return role != 'Administrador' && status == true;
        })
      )
    );
  }

  list_instructors(): Observable<any> {
    const url = `${base_url}/read_employees`;
    return this.http.get(url, this.headers).pipe(
      map(({ data }: any) =>
        data.filter((item: any) => {
          return item.role == 'Instructor' && item.status == true;
        })
      )
    );
  }
}
