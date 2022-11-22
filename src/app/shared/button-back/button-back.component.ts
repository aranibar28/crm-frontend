import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-button-back',
  templateUrl: './button-back.component.html',
})
export class ButtonBackComponent {
  constructor(private location: Location) {}

  back(): void {
    this.location.back();
  }
}
