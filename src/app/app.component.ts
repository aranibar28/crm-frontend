import { Component } from '@angular/core';
import { GuardsCheckEnd, GuardsCheckStart, NavigationCancel, Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private router: Router, private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    
    this.router.events.subscribe((e) => {
      if (e instanceof GuardsCheckStart) {
        this.spinner.show();
      }
      if (e instanceof GuardsCheckEnd || e instanceof NavigationCancel) {
        this.spinner.hide();
      }
    });
  }
}
