import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/services/auth.service';
import { sidebar } from 'src/app/utils/sidebar';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  public sidebar: any[] = sidebar;
  public role: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const helper = new JwtHelperService();
    let decodedToken = helper.decodeToken(this.authService.token);
    this.role = decodedToken['role'];
  }
}
