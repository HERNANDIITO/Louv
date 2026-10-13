import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-switch',
  imports: [],
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.scss'
})
export class SwitchComponent {
  text = input<string>();
  status = output<boolean>();
  checked = input<boolean>(false);

  change($event: Event) {
    const target = $event.target as HTMLInputElement;
    this.status.emit(target.checked);
  }
}
