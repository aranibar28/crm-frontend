import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, ReplaySubject, map, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ADMINISTRADOR } from 'src/app/utils/roles';
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  public courier = new ReplaySubject<any>();

  public emitter(res: any): void {
    this.courier.next(res);
  }

  public menu: any[] = [];

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: new HttpHeaders({ token: this.token }) };
  }
  
  login(data: any): Observable<any> {
    const url = `${base_url}/auth/login`;
    return this.http.post(url, data);
  }

  isValidateToken(): Observable<boolean> {
    return this.http.get(`${base_url}/auth/renew_token`, this.headers).pipe(
      map((res: any) => {
        localStorage.setItem('token', res.token);
        this.menu = res.menu;
        return true;
      }),
      catchError(() => of(false))
    );
  }

  isAuthenticated(allowRoles: string[]): boolean {
    if (!this.token) {
      return false;
    }
    try {
      const helper = new JwtHelperService();
      const decodeToken = helper.decodeToken(this.token);
      const isTokenExpired = helper.isTokenExpired(this.token);

      if (!decodeToken) {
        localStorage.removeItem('token');
        return false;
      }

      if (isTokenExpired) {
        localStorage.removeItem('token');
        return false;
      }

      return allowRoles.includes(decodeToken['role']);
    } catch (error) {
      localStorage.removeItem('token');
      return false;
    }
  }

  get payload(): any {
    const helper = new JwtHelperService();
    const decodeToken = helper.decodeToken(this.token);
    return decodeToken;
  }

  get id(): string {
    return this.payload['sub'];
  }

  get role(): string[] {
    return this.payload['role'];
  }

  get isAdmin(): boolean {
    return ADMINISTRADOR.includes(this.role);
  }

  isAllowed(allowRoles: any[]): boolean {
    return allowRoles.includes(this.role);
  }
}
