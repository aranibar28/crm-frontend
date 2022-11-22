import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
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

  validation(name: string, title: string, myForm: FormGroup) {
    const input = myForm.controls[name].errors;

    if (input?.['minlength']) {
      return `El ${title} debe tener mínimo ${input?.['minlength'].requiredLength} caracteres.`;
    }

    if (input?.['maxlength']) {
      return `El ${title} debe tener máximo ${input?.['maxlength'].requiredLength} caracteres.`;
    }

    if (input?.['email']) {
      return `El ${title} debe ser válido.`;
    }

    if (input?.['required']) {
      return `El ${title} es un campo requerido.`;
    } else {
      return `El ${title} tiene que tener solo caracteres numéricos.`;
    }
  }

  public months = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ];
}
