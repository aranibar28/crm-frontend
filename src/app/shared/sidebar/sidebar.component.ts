import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  public sidebar: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.sidebar = this.authService.sidebar;
  }
}
