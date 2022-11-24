import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  get user(): string {
    return localStorage.getItem('user') || '';
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
    this.clean_localStorage();
    this.router.navigateByUrl('/auth');
  }

  verify_token() {
    const url = `${base_url}/auth/verify_token`;
    return this.http.get(url, this.headers);
  }

  clean_localStorage() {
    localStorage.removeItem('id');
    localStorage.removeItem('user');
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
        this.clean_localStorage();
        return false;
      }

      if (!decodedToken) {
        this.clean_localStorage();
        return false;
      }
    } catch (error) {
      this.clean_localStorage();
      return false;
    }
    return allowRoles.includes(decodedToken['role']);
  }

  isAllowed(role: string[]) {
    const user = JSON.parse(this.user);
    if (!role.includes(user.role)) {
      this.router.navigateByUrl('/not-found');
    }
  }
}
