import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { PublicService } from 'src/app/services/public.service';
import { AuthService } from 'src/app/services/auth.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventory-product',
  templateUrl: './inventory-product.component.html',
})
export class InventoryProductComponent implements OnInit {
  @ViewChild('closeModal') closeModal!: ElementRef;
  public default_path = 'assets/images/resources/default.png';
  public allow: boolean = this.authService.isAdmin;

  public products: Array<any> = [];
  public varieties: Array<any> = [];
  public inventory: Array<any> = [];
  public inventory_arr: Array<any> = [];
  public earnings: Number = 0;
  public load_data = true;
  public load_btn = false;

  public title = '';
  public from = '';
  public to = '';

  constructor(
    private productService: ProductService,
    private publicService: PublicService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  myForm: FormGroup = this.fb.group({
    product: ['', [Validators.required]],
    variety: [{ value: '', disabled: true }, [Validators.required]],
    quantity: [, [Validators.required, Validators.min(1)]],
    unit_price: [, [Validators.required, Validators.min(1)]],
    supplier: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.from = moment().startOf('month').format('YYYY-MM-DD');
    this.to = moment().endOf('month').format('YYYY-MM-DD');
    this.list_title_product();
    this.list_inventory();
    this.publicService.get_company().subscribe({
      next: ({ data }) => (this.earnings = data?.earnings),
    });
  }

  list_inventory() {
    this.load_data = true;
    this.productService.list_inventory().subscribe({
      next: (res) => {
        this.inventory = res.data;
        this.inventory_arr = res.data;
        this.load_data = false;
      },
      error: (err) => {
        console.log(err);
        this.load_data = false;
      },
    });
  }

  list_title_product() {
    this.productService.list_title_product().subscribe({
      next: (res) => {
        this.products = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  delete_item(item: any) {
    Swal.fire({
      title: 'Quitar stock',
      text: `¿Desea quitar ${item.quantity} unidades?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#39afd1',
      cancelButtonColor: '#fa5c7c',
      confirmButtonText: 'Sí, quitar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.delete_inventory(item._id).subscribe((res) => {
          if (res.data) {
            this.list_inventory();
            Swal.fire('Listo', `${item.quantity} retirados.`, 'success');
          } else {
            Swal.fire('Advertencia', res.msg, 'warning');
          }
        });
      }
    });
  }

  filter() {
    if (!this.from || !this.to) {
      Swal.fire('Info', 'Debe seleccionar un rango de fecha.', 'info');
      return;
    }

    let from = Date.parse(this.from + 'T00:00:00') / 1000;
    let to = Date.parse(this.to + 'T23:59:59') / 1000;
    let term = new RegExp(this.title, 'i');
    this.inventory = [];

    for (let item of this.inventory_arr) {
      let fecha = Date.parse(item.created_at) / 1000;
      if (fecha >= from && fecha <= to) {
        if (term.test(item.product.title)) {
          this.inventory.push(item);
        }
      }
    }
  }

  select_product(event: any) {
    this.productService.read_variety_by_id(event.target.value).subscribe({
      next: (res) => {
        this.myForm.controls['variety'].enable();
        this.myForm.controls['variety'].reset('');
        this.varieties = res.data;
        if (this.varieties.length == 0) {
          this.myForm.controls['variety'].disable();
        }
      },
      error: (err) => console.log(err),
    });
  }

  register() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    this.load_btn = true;

    this.myForm.addControl('earnings', this.fb.control(this.earnings));
    this.productService.create_inventory(this.myForm.value).subscribe({
      next: (res) => {
        this.load_btn = false;
        if (res.data) {
          Swal.fire('Listo', 'Nuevo ingreso agregado.', 'success');
          this.closeModal.nativeElement.click();
          this.myForm.reset({
            product: '',
            variety: '',
            supplier: '',
            earnings: this.earnings,
          });
          this.list_inventory();
        } else {
          Swal.fire('Error', res.msg, 'error');
        }
      },
      error: (err) => {
        this.load_btn = false;
        console.log(err);
      },
    });
  }

  validators(item: string) {
    const input = this.myForm.controls[item];
    return input.errors && input.touched;
  }
}
