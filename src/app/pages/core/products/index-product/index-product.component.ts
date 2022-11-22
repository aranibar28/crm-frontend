import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-index-product',
  templateUrl: './index-product.component.html',
})
export class IndexProductComponent implements OnInit {
  public default_path = 'assets/images/resources/default.png';
  public products: Array<any> = [];
  public products_arr: Array<any> = [];
  public categories: Array<any> = [];

  public load_data: boolean = true;
  public toggle: boolean = false;
  public p: number = 1;

  public filter_category: string = 'Todos';
  public filter_status: string = 'Todos';
  public filter_title: string = '';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.init_data();
    this.init_categories();
  }

  init_data() {
    this.load_data = true;
    this.productService.read_products().subscribe({
      next: (res) => {
        for (let item of res.data) {
          item.image = item.image?.secure_url;
          item.category = item.category.title;
        }
        this.products = res.data;
        this.products_arr = res.data;
        this.load_data = false;
      },
      error: (err) => {
        console.log(err);
        this.load_data = false;
      },
    });
  }

  init_categories() {
    this.categoryService.read_categories().subscribe({
      next: (res) => (this.categories = res.data),
    });
  }

  change_status(event: any, id: any) {
    let status = event.target.checked;
    this.productService.change_status(id, { status }).subscribe({
      next: (res) => {
        if (!res.data) {
          this.init_data();
        }
      },
    });
  }

  delete_item(item: any) {
    Swal.fire({
      title: 'Eliminar Producto',
      text: `¿Desea eliminar el producto ${item.title}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#39afd1',
      cancelButtonColor: '#fa5c7c',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.delete_product(item._id).subscribe((res) => {
          if (res.data) {
            this.p = 1;
            this.init_data();
            Swal.fire('Listo!', `Producto ${item.title} eliminado.`, 'success');
          } else {
            Swal.fire('Error!', res.msg, 'error');
          }
        });
      }
    });
  }

  filter() {
    const term = new RegExp(this.filter_title, 'i');
    if (this.filter_category == 'Todos') {
      if (this.filter_status == 'Todos') {
        this.products = this.products_arr.filter((item) =>
          term.test(item.title)
        );
      } else {
        if (this.filter_status == 'Publicado') {
          this.products = this.products_arr.filter(
            (item) => term.test(item.title) && item.status
          );
        } else if (this.filter_status == 'Borrador') {
          this.products = this.products_arr.filter(
            (item) => term.test(item.title) && !item.status
          );
        }
      }
    } else {
      if (this.filter_status == 'Todos') {
        this.products = this.products_arr.filter(
          (item) =>
            term.test(item.title) && item.category == this.filter_category
        );
      } else {
        if (this.filter_status == 'Publicado') {
          this.products = this.products_arr.filter(
            (item) =>
              term.test(item.title) &&
              item.status &&
              item.category == this.filter_category
          );
        } else if (this.filter_status == 'Borrador') {
          this.products = this.products_arr.filter(
            (item) =>
              term.test(item.title) &&
              !item.status &&
              item.category == this.filter_category
          );
        }
      }
    }
  }

  sortby = (key: string) => {
    this.toggle = !this.toggle;
    let direction = this.toggle ? 1 : -1;
    this.products.sort((a: any, b: any) => {
      if (a[key] < b[key]) {
        return 1 * direction;
      }
      if (a[key] > b[key]) {
        return -1 * direction;
      }
      return 0;
    });
  };
}
