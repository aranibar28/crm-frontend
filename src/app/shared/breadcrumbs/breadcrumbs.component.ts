import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
})
export class BreadcrumbsComponent implements OnDestroy {
  public title: string = '';
  public role: string[] = ['Administrador', 'Gerente'];
  public titleSubs$!: Subscription;

  constructor(private router: Router, private authService: AuthService) {
    this.titleSubs$ = this.get_route_arguments().subscribe(
      ({ title, role }) => {
        this.role = role;
        this.title = title;
        document.title = `Panel - ${title}`;
        this.authService.isAllowed(this.role);
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
