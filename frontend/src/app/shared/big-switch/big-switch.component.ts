import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-big-switch',
  imports: [],
  templateUrl: './big-switch.component.html',
  styleUrl: './big-switch.component.scss'
})
export class BigSwitchComponent {
  onValue = input.required<string>();
  offValue = input.required<string>();
  checked = input<boolean>(false);
  status = output<boolean>();

  toggle() {
    this.status.emit(!this.checked());
  }
}
