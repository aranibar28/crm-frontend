import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from 'src/app/services/customer.service';
import { PublicService } from 'src/app/services/public.service';
import { SaleService } from 'src/app/services/sale.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProductService } from 'src/app/services/product.service';
declare var $: any;

@Component({
  selector: 'app-create-sale',
  templateUrl: './create-sale.component.html',
})
export class CreateSaleComponent implements OnInit {
  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild('filter_variety') filter_variety!: ElementRef;
  public default_path = 'assets/images/resources/default.png';

  public load_btn: boolean = false;
  public toggle: boolean = false;

  public load_customers = false;
  public filter_customer: string = '';
  public customers: Array<any> = [];
  public channels: Array<any> = [];

  public load_varieties = false;
  public varieties: Array<any> = [];
  public varieties_arr: Array<any> = [];

  public selected: any = {};
  public details: Array<any> = [];

  public total_amount = 0;
  public total_products = 0;

  constructor(
    private customerService: CustomerService,
    private publicService: PublicService,
    private productService: ProductService,
    private saleServices: SaleService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.details = JSON.parse(localStorage.getItem('details') || '[]');
    this.init_channels();
    this.init_varieties();
    this.calculate_total();
  }

  myForm: FormGroup = this.fb.group({
    customer: [, [Validators.required]],
    origin: ['Interno', [Validators.required]],
    channel: ['', [Validators.required]],
    method: ['', [Validators.required]],
    bank: ['', [Validators.required]],
    amount: [, [Validators.required]],
  });

  search_customers() {
    this.load_customers = true;
    this.customerService.read_customers(this.filter_customer).subscribe({
      next: (res) => {
        this.customers = res.data;
        this.load_customers = false;
      },
      error: (err) => {
        console.log(err);
        this.load_customers = false;
      },
    });
  }

  select_customer(item: any) {
    this.closeModal.nativeElement.click();
    this.myForm.patchValue({ customer: item._id });
    $('#input_customer').val(item.full_name);
  }

  init_channels() {
    this.publicService.get_company().subscribe({
      next: (res) => {
        this.channels = res.data?.channels;
      },
    });
  }

  init_varieties() {
    this.load_varieties = true;
    this.varieties = [];
    this.productService.read_varieties().subscribe({
      next: (res) => {
        for (let item of res.data) {
          item.quantity = 1;
          if (item.stock >= 1) {
            this.varieties.push(item);
          }
        }
        this.varieties_arr = this.varieties;
        this.load_varieties = false;
      },
      error: (err) => {
        this.load_varieties = false;
        console.log(err);
      },
    });
  }

  search_variety() {
    var term = new RegExp(this.filter_variety.nativeElement.value, 'i');
    if (this.filter_variety) {
      this.varieties = this.varieties_arr.filter((item) =>
        term.test(item.product.title)
      );
    } else {
      this.init_varieties();
    }
  }

  increase_qty(idx: any) {
    this.varieties[idx].quantity = this.varieties[idx].quantity + 1;
  }

  decrease_qty(idx: any) {
    this.varieties[idx].quantity = this.varieties[idx].quantity - 1;
  }

  add_item(item: any, i: any) {
    if (item.quantity >= 1) {
      const product = this.details.find((x) => x.variety === item._id);

      let enter_stock = product?.quantity || 0;
      let stock = enter_stock + item.quantity;

      if (item.stock >= stock) {
        if (product) {
          product.quantity += item.quantity;
          product.price = item.product.price;
        } else {
          this.details.push({
            product: item.product._id,
            variety: item._id,
            quantity: item.quantity,
            price: item.product.price,
            temp_product: item.product.title,
            temp_type: item.product.variety,
            temp_variety: item.title,
            temp_image: item.product.image?.secure_url,
          });
        }
        this.calculate_total();
        this.varieties[i].quantity = 1;
        localStorage.setItem('details', JSON.stringify(this.details));
      } else {
        Swal.fire('', 'Stock máximo: ' + item.stock + ' unidades.', 'info');
      }
    } else {
      Swal.fire('', 'Debe seleccionar al menos un item.', 'info');
    }
  }

  del_item(item: any, i: any) {
    let subtotal = item.quantity * item.price;
    this.total_amount -= subtotal;
    this.total_products -= item.quantity;
    this.details.splice(i, 1);
    localStorage.setItem('details', JSON.stringify(this.details));
  }

  calculate_total() {
    this.total_amount = 0;
    this.total_products = 0;
    for (let item of this.details) {
      let subtotal = item.quantity * item.price;
      this.total_amount += subtotal;
      this.total_products += item.quantity;
    }
  }

  select_method(item: any) {
    this.myForm.controls['method'].setValue(item);
    $('#dropdownMethod').text(item);
  }

  select_bank(item: any) {
    this.myForm.controls['bank'].setValue(item);
    $('#dropdownBank').text(item);
  }

  register_sale() {
    this.myForm.controls['amount'].setValue(this.total_amount);

    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    if (this.details.length == 0) {
      Swal.fire('', 'Debe seleccionar al menos un item.', 'info');
      return;
    }

    this.load_btn = true;
    this.myForm.addControl('details', this.fb.control(this.details));
    this.saleServices.create_sale(this.myForm.value).subscribe({
      next: (res) => {
        if (res.data) {
          this.load_btn = false;
          this.router.navigateByUrl('/sales');
          localStorage.removeItem('details');
          Swal.fire('Listo', 'Compra realizada.', 'success');
        } else {
          Swal.fire('Error', 'Ocurrió un error al procesar la venta.', 'error');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  validators(name: string) {
    const input = this.myForm.controls[name];
    return input.errors && input.touched;
  }
}
