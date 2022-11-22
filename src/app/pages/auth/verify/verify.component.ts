import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicService } from 'src/app/services/public.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
})
export class VerifyComponent implements OnInit {
  public load_data: boolean = true;
  public token: string = '';
  public message: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private publicService: PublicService
  ) {}

  ngOnInit(): void {
    this.init_data();
  }

  init_data() {
    this.activatedRoute.params.subscribe({
      next: (res) => {
        this.token = res['token'];
        if (this.token) {
          this.load_data = true;
          this.publicService.confirm_email_verify(this.token).subscribe({
            next: (res) => {
              if (res.data) {
                this.message = 'La cuenta fue verificada correctamente.';
              } else {
                this.message = res.msg;
              }
              this.load_data = false;
            },
          });
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
