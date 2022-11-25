import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
})
export class CoreComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.verify_token().subscribe({
      next: (res) => {
        if (!res.data) {
          this.router.navigateByUrl('/auth');
        }
      },
      error: (err) => {
        console.log(err);
        this.router.navigateByUrl('/auth');
      },
    });
  }
}
