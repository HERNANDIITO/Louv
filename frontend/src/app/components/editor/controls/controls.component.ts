import { Component } from '@angular/core';
import { faArrowsRotate, faComputerMouse, faUpDownLeftRight, faMagnifyingGlass, faRing } from "@fortawesome/free-solid-svg-icons";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-controls',
  imports: [FaIconComponent],
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.scss'
})
export class ControlsComponent {
  faArrowsRotate = faArrowsRotate
  faComputerMouse = faComputerMouse
  faUpDownLeftRight = faUpDownLeftRight
  faMagnifyingGlass = faMagnifyingGlass
  faRing = faRing
}
