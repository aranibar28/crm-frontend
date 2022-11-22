import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-tracking-customer',
  templateUrl: './tracking-customer.component.html',
})
export class TrackingCustomerComponent implements OnInit {
  public default_path = 'assets/images/resources/default.png';
  public load_data: boolean = true;
  public customer: any = {};
  public id: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => (this.id = id));
    this.init_data();
  }

  init_data() {
    this.customerService.read_customer_by_id(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.customer = res.data;
          let name1 = this.customer.first_name.split(' ')[0];
          let name2 = this.customer.last_name.split(' ')[0];
          this.customer.full_name = name1 + ' ' + name2;
        } else {
          this.router.navigateByUrl('/customers');
        }
        this.load_data = false;
      },
      error: (err) => {
        console.log(err);
        this.load_data = false;
      },
    });
  }
}
