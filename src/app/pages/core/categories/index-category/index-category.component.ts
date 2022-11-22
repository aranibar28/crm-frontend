import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-index-category',
  templateUrl: './index-category.component.html',
})
export class IndexCategoryComponent implements OnInit {
  public default_path = 'assets/images/resources/default.png';
  public categories: Array<any> = [];
  public categories_arr: Array<any> = [];

  public load_data: boolean = true;
  public toggle: boolean = false;
  public keyword: string = '';
  public p: number = 1;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.init_data();
  }

  init_data() {
    this.load_data = true;
    this.categoryService.read_categories().subscribe({
      next: (res) => {
        this.load_data = false;
        this.categories = res.data;
        this.categories_arr = res.data;
      },
      error: (err) => {
        this.load_data = false;
        console.log(err);
      },
    });
  }

  delete_item(item: any) {
    Swal.fire({
      title: 'Eliminar Categoría',
      text: `¿Desea eliminar la categoría ${item.title}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#39afd1',
      cancelButtonColor: '#fa5c7c',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.delete_category(item._id).subscribe((res) => {
          if (res.data) {
            this.p = 1;
            this.init_data();
            Swal.fire('Listo!', `Categoría ${name} eliminada.`, 'success');
          } else {
            Swal.fire('Error!', res.msg, 'error');
          }
        });
      }
    });
  }

  change_status(event: any, id: any) {
    let status = event.target.checked;
    let word = status ? 'activado' : 'desactivado';
    this.categoryService.change_status(id, { status }).subscribe({
      next: (res) => {
        if (res.data) {
          Swal.fire('Listo', `Estado ${word}.`, 'success');
        } else {
          this.init_data();
          Swal.fire('Error', res.msg, 'error');
        }
      },
    });
  }

  search() {
    if (this.keyword) {
      var term = new RegExp(this.keyword, 'i');
      this.categories = this.categories_arr.filter(
        (item) =>
          term.test(item.title) || term.test(item.email) || term.test(item.dni)
      );
    } else {
      this.categories = this.categories_arr;
    }
  }

  sortby = (key: string) => {
    this.toggle = !this.toggle;
    let direction = this.toggle ? 1 : -1;
    this.categories.sort((a: any, b: any) => {
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
