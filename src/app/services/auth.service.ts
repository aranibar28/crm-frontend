import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, ReplaySubject, filter, map } from 'rxjs';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  public courier = new ReplaySubject<string>();

  public emitter(value: string): void {
    this.courier.next(value);
  }

  public courier2 = new ReplaySubject<string>();

  public emitter2(value: string): void {
    this.courier2.next(value);
  }

  get id(): string {
    return localStorage.getItem('id') || '';
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { token: this.token } };
  }

  login(data: any): Observable<any> {
    const url = `${base_url}/employees/login_employee`;
    return this.http.post(url, data);
  }

  logout() {
    this.cleanLocalStorage();
    this.router.navigateByUrl('/auth');
  }

  verify_token(): Observable<any> {
    const url = `${base_url}/seed/verify_token`;
    return this.http.get(url, this.headers);
  }

  cleanLocalStorage() {
    localStorage.removeItem('id');
    localStorage.removeItem('token');
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
        this.cleanLocalStorage();
        return false;
      }

      if (!decodedToken) {
        this.cleanLocalStorage();
        return false;
      }
    } catch (error) {
      this.cleanLocalStorage();
      return false;
    }
    return allowRoles.includes(decodedToken['role']);
  }

  get role(): string[] {
    const helper = new JwtHelperService();
    let decodedToken = helper.decodeToken(this.token);
    return decodedToken['role'];
  }

  isAllowed(allowRoles: string[]): boolean {
    const helper = new JwtHelperService();
    let decodedToken = helper.decodeToken(this.token);
    return allowRoles.includes(decodedToken['role']);
  }

  get_route_arguments() {
    return this.router.events.pipe(
      filter((event) => event instanceof ActivationEnd),
      filter((event: any) => event.snapshot.firstChild == null),
      map((event: any) => event.snapshot.data)
    );
  }
}
