import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-no-footer-layout',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './no-footer-layout.component.html',
  styleUrl: './no-footer-layout.component.scss'
})
export class NoFooterLayoutComponent {

}
