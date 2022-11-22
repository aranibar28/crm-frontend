import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-exit-inventory',
  templateUrl: './exit-inventory.component.html',
})
export class ExitInventoryComponent implements OnInit {
  @ViewChild('closeModal') closeModal!: ElementRef;
  public months: Array<any> = [];
  public inventory: Array<any> = [];
  public categories: Array<any> = [];

  public filter_year: string = '2022';
  public filter_month: string = 'Todos';

  public load_data: boolean = false;
  public toggle: boolean = false;
  public p: number = 1;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.init_categories();
    this.search();
  }

  init_categories() {
    this.categoryService.read_categories().subscribe({
      next: (res) => (this.categories = res.data),
    });
  }

  search() {
    this.load_data = true;
    this.productService
      .list_inventory_exit(this.filter_year, this.filter_month)
      .subscribe({
        next: (res) => {
          this.months = res.months;
          this.inventory = [];
          for (let item of res.data) {
            this.inventory.push({
              sku: item.variety.sku,
              product: item.product.title,
              variety: item.variety.title,
              entry: item._id,
              category: item.product.category.title,
              quantity: item.quantity,
              price: item.price,
              created_at: item.created_at,
            });
          }
          this.load_data = false;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  refresh() {
    this.filter_year = '2022';
    this.filter_month = 'Todos';
    this.inventory = [];
  }

  sortby = (key: string) => {
    this.toggle = !this.toggle;
    let direction = this.toggle ? 1 : -1;
    this.inventory.sort((a: any, b: any) => {
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
