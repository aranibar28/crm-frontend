import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ADMINISTRADOR } from 'src/app/utils/sidebar';
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  public courier = new ReplaySubject<string>();

  public emitter(value: string): void {
    this.courier.next(value);
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { token: this.token } };
  }

  isAuthenticated(allowRoles: string[]): boolean {
    if (!this.token) {
      return false;
    }
    try {
      const helper = new JwtHelperService();
      var isExpired = helper.isTokenExpired(this.token);
      var decodedToken = helper.decodeToken(this.token);

      if (isExpired) {
        localStorage.removeItem('token');
        return false;
      }

      if (!decodedToken) {
        localStorage.removeItem('token');
        return false;
      }
    } catch (error) {
      localStorage.removeItem('token');
      return false;
    }
    return allowRoles.includes(decodedToken['role']);
  }

  get id(): string {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(this.token);
    return decodedToken['sub'];
  }

  get role(): string[] {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(this.token);
    return decodedToken['role'];
  }

  get isAdmin(): boolean {
    return ADMINISTRADOR.includes(this.role);
  }

  isAllowed(allowRoles: any[]): boolean {
    return allowRoles.includes(this.role);
  }

  login(data: any): Observable<any> {
    const url = `${base_url}/employees/login_employee`;
    return this.http.post(url, data);
  }

  verify_token(): Observable<any> {
    const url = `${base_url}/seed/verify_token`;
    return this.http.get(url, this.headers);
  }
}
