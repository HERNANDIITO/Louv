import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-input',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {
  faSearch = faSearch;
  
  customClass = input<string>();
  icon = input<string>();
  initialValue = input<string | undefined>("");
  placeholder = input<string>("Buscar...");
  value = output<string>();
  
  onChange(event: any) {
    this.value.emit(event.target.value);
  }

}
