import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicService } from 'src/app/services/public.service';
import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';
import { validation } from 'src/app/utils/validation';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
})
export class UpdateProductComponent implements OnInit {
  public imgSelected: any = 'assets/images/resources/product.png';
  public imgCurrent: any = 'assets/images/resources/product.png';
  public categories: Array<any> = [];
  public varieties: Array<any> = [];
  public varieties_list: Array<any> = [];
  public product: any = {};

  public load_data: boolean = true;
  public load_btn: boolean = false;
  public load_btn_variety: boolean = false;
  public file: File | undefined;
  public id: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private publicService: PublicService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => (this.id = id));
    this.init_data();
    this.init_categories();
    this.init_list_varieties();
  }

  myForm: FormGroup = this.fb.group({
    title: [, [Validators.required, Validators.minLength(3)]],
    category: ['', [Validators.required]],
    type: ['', [Validators.required]],
    variety: [, [Validators.required]],
    description: [, Validators.required],
  });

  myFormSku: FormGroup = this.fb.group({
    title: [, [Validators.required, Validators.minLength(3)]],
    sku: [, [Validators.required]],
  });

  init_data() {
    this.load_data = true;
    this.productService.read_product_by_id(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.product = res.data;
          this.myForm.patchValue(this.product);
          if (this.product.image?.secure_url) {
            this.imgSelected = this.product.image.secure_url;
            this.imgCurrent = this.product.image.secure_url;
          }
        } else {
          this.router.navigateByUrl('/products');
        }
      },
      error: (err) => console.log(err),
    });
    this.init_varieties();
  }

  init_categories() {
    this.categoryService.read_categories().subscribe({
      next: (res) => (this.categories = res.data),
    });
  }
  init_list_varieties() {
    this.publicService.get_company().subscribe({
      next: (res) => {
        if (res.data) {
          this.varieties_list = res.data.varieties;
        }
      },
    });
  }

  init_varieties() {
    this.productService.read_variety_by_id(this.id).subscribe({
      next: (res) => {
        this.varieties = res.data;
        this.load_data = false;
      },
      error: (err) => {
        console.log(err);
        this.load_data = false;
      },
    });
  }

  update() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    if (this.file) {
      const img = this.fb.control(this.file);
      this.myForm.addControl('image', img);
    }

    this.load_btn = true;
    this.productService.update_product(this.id, this.myForm.value).subscribe({
      next: (res) => {
        this.load_btn = false;
        if (res.data) {
          this.router.navigateByUrl('/products');
          Swal.fire('Listo', 'Se actualizó  correctamente', 'success');
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

  generate_sku() {
    const title = String(this.myForm.controls['title'].value);
    const type = String(this.myForm.controls['type'].value);
    const variety = String(this.myForm.controls['variety'].value);
    const sku_title = String(this.myFormSku.controls['title'].value);
    let product_type = type.charAt(0);
    let product_title = title.substring(0, 3);
    let product_variety = variety.substring(0, 3);
    let name = sku_title.substring(0, 3);
    let sku = `${product_type}-${product_title}-${product_variety}-${name}`;
    this.myFormSku.controls['sku'].setValue(sku.toUpperCase());
  }

  create_variety() {
    if (this.myFormSku.invalid) {
      Swal.fire('Error', 'Debe completar los campos', 'error');
    }
    this.load_btn_variety = true;
    this.productService
      .create_variety(this.id, this.myFormSku.value)
      .subscribe({
        next: (res) => {
          this.load_btn_variety = false;
          if (res.data) {
            this.init_data();
            this.myFormSku.reset();
            Swal.fire('Listo', 'Se agregó  correctamente', 'success');
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  delete_item(item: any) {
    Swal.fire({
      title: 'Eliminar Variedad',
      text: `¿Desea eliminar el Variedad ${item.sku}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#39afd1',
      cancelButtonColor: '#fa5c7c',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.delete_variety(item._id).subscribe((res) => {
          if (res.data) {
            this.init_data();
            Swal.fire('Listo!', `Variedad ${item.sku} eliminado.`, 'success');
          } else {
            Swal.fire('Error!', res.msg, 'error');
          }
        });
      }
    });
  }

  validators(item: string) {
    const input = this.myForm.controls[item];
    return input.errors && input.touched;
  }

  message(item: string, title: string) {
    return validation(item, title, this.myForm);
  }

  fileChanged(event: any) {
    const file: File = event.target.files[0];
    if (!file) {
      this.file = undefined;
      this.imgSelected = this.imgCurrent;
    } else {
      if (file.size <= 4000000) {
        const array = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
        if (array.includes(file.type)) {
          const reader = new FileReader();
          reader.onload = () => (this.imgSelected = reader.result);
          reader.readAsDataURL(file);
          this.file = file;
        } else {
          this.file = undefined;
          this.imgSelected = this.imgCurrent;
          Swal.fire('Error', 'El archivo debe ser una imagen', 'error');
        }
      } else {
        this.file = undefined;
        this.imgSelected = this.imgCurrent;
        Swal.fire('Error', 'La imagen no puede superar los 4MB', 'error');
      }
    }
  }
}
