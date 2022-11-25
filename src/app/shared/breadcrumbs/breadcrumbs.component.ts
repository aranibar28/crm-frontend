import { Component, OnDestroy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { EMPLEADOS } from 'src/app/utils/sidebar';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
})
export class BreadcrumbsComponent implements OnDestroy {
  public title: string = '';
  public titleSubs$!: Subscription;

  constructor(private router: Router, private authService: AuthService) {
    this.titleSubs$ = this.authService
      .get_route_arguments()
      .subscribe(({ title, role }) => {
        this.title = title;
        document.title = 'Panel - ' + title;
        const allow = this.authService.isAllowed(role || EMPLEADOS);
        if (!allow) {
          this.router.navigateByUrl('not-found');
        }
      });
  }

  ngOnDestroy(): void {
    this.titleSubs$.unsubscribe();
    document.title = 'Backoffice';
  }
}
