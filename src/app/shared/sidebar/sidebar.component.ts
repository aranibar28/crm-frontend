import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  public sidebar: any;
  public user: any = {};

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user')!);
    this.sidebar = this.authService.sidebar;
  }
}
