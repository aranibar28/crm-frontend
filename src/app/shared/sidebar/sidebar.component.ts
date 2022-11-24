import { Component, OnInit } from '@angular/core';
import { sidebar } from 'src/app/utils/sidebar';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  public sidebar: any;
  public user: any = {};

  constructor() {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user')!);
    this.sidebar = sidebar;
  }
}
