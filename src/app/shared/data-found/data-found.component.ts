import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-data-found',
  templateUrl: './data-found.component.html',
})
export class DataFoundComponent {
  @Input() title: string = 'Datos';
}
