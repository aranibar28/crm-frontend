import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button-submit',
  templateUrl: './button-submit.component.html',
})
export class ButtonSubmitComponent implements OnInit {
  @Input() status: boolean = true;
  constructor() {}

  ngOnInit(): void {}
}
