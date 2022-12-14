import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
const base_url = environment.base_url + '/seed';
const sunat_url = environment.sunat;
const token = environment.token;

@Injectable({
  providedIn: 'root',
})
export class PublicService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { token: this.token } };
  }

  get_user(number: any): Observable<any> {
    const url = `${sunat_url}/dni/${number}?token=${token}`;
    return this.http.get(url);
  }

  get_company(): Observable<any> {
    const url = `${base_url}/get_company`;
    return this.http.get(url, this.headers);
  }

  update_company(data: any): Observable<any> {
    const url = `${base_url}/update_company`;
    if (data.logo) {
      const fd = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] instanceof Array) {
          fd.append(key, JSON.stringify(data[key]));
        } else {
          fd.append(key, data[key]);
        }
      });
      return this.http.put(url, fd, this.headers);
    } else {
      return this.http.put(url, data, this.headers);
    }
  }

  confirm_email_verify(token: any): Observable<any> {
    const url = `${base_url}/confirm_email_verify/${token}`;
    return this.http.get(url, this.headers);
  }

  generate_token(inscription: any, customer: any): Observable<any> {
    const url = `${base_url}/generate_token/${inscription}/${customer}`;
    return this.http.get(url, this.headers);
  }

  send_survey(data: any): Observable<any> {
    const url = `${base_url}/send_survey`;
    return this.http.post(url, data, this.headers);
  }

  read_survey(id: any): Observable<any> {
    const url = `${base_url}/read_survey/${id}`;
    return this.http.get(url, this.headers);
  }

  uploadImage(event: any): Observable<any> {
    const file: File = event.target.files[0];
    const pattern = /image-*/;

    const finished = new Observable((observer) => {
      observer.next(undefined);
      observer.complete();
    });

    if (!file) {
      return finished;
    }

    if (!file.type.match(pattern)) {
      Swal.fire('Error', 'El archivo debe ser una imagen.', 'error');
      return finished;
    }

    if (file.size >= 4000000) {
      Swal.fire('Error', 'La imagen no puede superar los 4MB.', 'error');
      return finished;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    return new Observable((observer: any) => {
      reader.onloadend = () => {
        observer.next(reader.result);
        observer.complete();
      };
    });
  }
}
