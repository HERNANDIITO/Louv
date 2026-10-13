import {
  Component,
  output,
  signal,
} from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  faGem,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import { ProfileNavComponent } from "./profile-nav/profile-nav.component";
import { MyOrdersComponent } from "./my-orders/my-orders.component";
import { MyDataComponent } from "./my-data/my-data.component";
import { MyDesignsComponent } from "./my-designs/my-designs.component";

@Component({
  selector: "app-profile-overlay",
  standalone: true,
  imports: [
    FontAwesomeModule,
    ProfileNavComponent,
    MyOrdersComponent,
    MyDataComponent,
    MyDesignsComponent
  ],
  templateUrl: "./profile-overlay.component.html",
  styleUrl: "./profile-overlay.component.scss",
})
export class ProfileOverlayComponent {
  faGem = faGem;
  faXmark = faXmark;

  close = output<void>();

  active = signal("Mis anillos");


  changeView(name: string) {
    this.active.set(name);
  }
  onClose(){
    this.close.emit();
  }
}
