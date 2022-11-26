import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url + '/courses';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { token: this.token } };
  }

  create_course(data: any): Observable<any> {
    const url = `${base_url}/create_course`;
    if (data.image) {
      const fd = new FormData();
      Object.keys(data).forEach((key) => fd.append(key, data[key]));
      return this.http.post(url, fd, this.headers);
    } else {
      return this.http.post(url, data, this.headers);
    }
  }

  read_courses(): Observable<any> {
    const url = `${base_url}/read_courses`;
    return this.http.get(url, this.headers);
  }

  read_course_by_id(id: any): Observable<any> {
    const url = `${base_url}/read_course_by_id/${id}`;
    return this.http.get(url, this.headers);
  }

  update_course(id: any, data: any): Observable<any> {
    const url = `${base_url}/update_course/${id}`;
    if (data.image) {
      const fd = new FormData();
      Object.keys(data).forEach((key) => fd.append(key, data[key]));
      return this.http.put(url, fd, this.headers);
    } else {
      return this.http.put(url, data, this.headers);
    }
  }

  delete_course(id: any): Observable<any> {
    const url = `${base_url}/delete_course/${id}`;
    return this.http.delete(url, this.headers);
  }

  change_status(id: any, data: any): Observable<any> {
    const url = `${base_url}/change_status/${id}`;
    return this.http.put(url, data, this.headers);
  }

  list_courses(): Observable<any> {
    const url = `${base_url}/read_courses`;
    return this.http.get(url, this.headers).pipe(
      map(({ data }: any) =>
        data
          .map(({ _id, title, status }: any) => ({ _id, title, status }))
          .filter((item: any) => {
            return item.status == true;
          })
      )
    );
  }
}
