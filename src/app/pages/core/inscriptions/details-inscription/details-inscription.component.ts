import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InscriptionService } from 'src/app/services/inscription.service';
import { PublicService } from 'src/app/services/public.service';

@Component({
  selector: 'app-details-inscription',
  templateUrl: './details-inscription.component.html',
})
export class DetailsInscriptionComponent implements OnInit {
  public default_path = 'assets/images/resources/default.png';
  public company: any = {};
  public inscription: any = {};
  public details: Array<any> = [];
  public load_data = false;
  public my_data = false;
  public id: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private publicService: PublicService,
    private inscriptionService: InscriptionService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => (this.id = id));
    this.init_data();
    this.init_company();
  }

  init_data() {
    this.load_data = true;
    this.inscriptionService.read_inscription_by_id(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.my_data = true;
          this.load_data = false;
          this.inscription = res.data;
          this.details = res.details;
        } else {
          this.my_data = false;
          this.load_data = false;
        }
      },
    });
  }

  init_company() {
    this.publicService.get_company().subscribe({
      next: (res) => {
        this.company = res.data;
      },
    });
  }
}
