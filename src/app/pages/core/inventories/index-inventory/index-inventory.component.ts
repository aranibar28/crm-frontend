import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-index-inventory',
  templateUrl: './index-inventory.component.html',
})
export class IndexInventoryComponent implements OnInit {
  @ViewChild('closeModal') closeModal!: ElementRef;
  public inventory: Array<any> = [];
  public inventory_arr: Array<any> = [];
  public categories: Array<any> = [];

  public filter_text: string = '';
  public filter_type: string = 'Todos';
  public filter_category: string = 'Todos';

  public load_data: boolean = false;
  public toggle: boolean = false;
  public p: number = 1;

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
    this.productService.list_inventory_general().subscribe({
      next: (res) => {
        this.inventory = [];
        for (let item of res.data) {
          this.inventory.push({
            sku: item.sku,
            product: item.product.title,
            variety: item.title,
            category: item.product.category.title,
            type: item.product.type,
            stock: item.stock,
            price: item.product.price,
            updated_at: item.updated_at,
          });
        }

        this.inventory_arr = this.inventory;
        this.load_data = false;
      },
    });
  }

  init_categories() {
    this.categoryService.read_categories().subscribe({
      next: (res) => (this.categories = res.data),
    });
  }

  search() {
    let term_text = new RegExp(this.filter_text, 'i');
    let term_type = new RegExp(this.filter_type, 'i');
    let term_category = new RegExp(this.filter_category, 'i');

    this.inventory = [];
    for (let item of this.inventory_arr) {
      if (this.filter_type == 'Todos') {
        if (this.filter_category == 'Todos') {
          if (term_text.test(item.sku) || term_text.test(item.product)) {
            this.inventory.push(item);
          }
        } else {
          if (term_category.test(item.category)) {
            if (term_text.test(item.sku) || term_text.test(item.product)) {
              this.inventory.push(item);
            }
          }
        }
      } else {
        if (term_type.test(item.type)) {
          if (this.filter_category == 'Todos') {
            if (term_text.test(item.sku) || term_text.test(item.product)) {
              this.inventory.push(item);
            }
          } else {
            if (term_category.test(item.category)) {
              if (term_text.test(item.sku) || term_text.test(item.product)) {
                this.inventory.push(item);
              }
            }
          }
        }
      }
    }
  }

  refresh() {
    this.filter_text = '';
    this.filter_type = 'Todos';
    this.filter_category = 'Todos';
    this.inventory = this.inventory_arr;
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
