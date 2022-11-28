import { Component, OnDestroy } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Subscription, filter, map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { EMPLEADOS } from 'src/app/utils/roles';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
})
export class BreadcrumbsComponent implements OnDestroy {
  public title: string = '';
  public titleSubs$!: Subscription;

  constructor(private router: Router, private authService: AuthService) {
    this.titleSubs$ = this.get_route_arguments().subscribe(
      ({ title, role }) => {
        this.title = title;
        document.title = 'Panel - ' + title;
        const allow = this.authService.isAllowed(role || EMPLEADOS);
        if (!allow) {
          this.router.navigateByUrl('/');
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.titleSubs$.unsubscribe();
    document.title = 'Backoffice';
  }

  get_route_arguments() {
    return this.router.events.pipe(
      filter((event) => event instanceof ActivationEnd),
      filter((event: any) => event.snapshot.firstChild == null),
      map((event: any) => event.snapshot.data)
    );
  }
}
