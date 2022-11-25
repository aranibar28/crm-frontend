import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { sidebar } from 'src/app/utils/sidebar';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  public role: string[] = this.authService.role;
  public sidebar: any[] = sidebar;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}
}
