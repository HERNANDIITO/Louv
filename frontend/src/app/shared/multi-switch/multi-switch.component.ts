import { Component, input, output } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faGem, faObjectGroup } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-multi-switch',
  imports: [FaIconComponent],
  templateUrl: './multi-switch.component.html',
  styleUrl: './multi-switch.component.scss'
})
export class MultiSwitchComponent {
  faObjectGroup = faObjectGroup;
  faGem = faGem;
  options = input.required<string[]>(); // ['Opción 1', 'Opción 2', 'Opción 3']
  selectedIndex = input<number>(0);
  selectionChange = output<number>();
  optionType = input<"gem" | "group">("gem");

  select(index: number) {
    this.selectionChange.emit(index);
  }
} 
