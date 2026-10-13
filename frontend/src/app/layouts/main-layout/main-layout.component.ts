import { Component, signal } from "@angular/core";
import { FooterComponent } from "../../shared/footer/footer.component";
import { HeaderComponent } from "../../shared/header/header.component";
import { RouterOutlet } from "@angular/router";

@Component({
  standalone: true,
  selector: "app-main-layout",
  imports: [HeaderComponent, FooterComponent, RouterOutlet],
  templateUrl: "./main-layout.component.html",
  styleUrl: "./main-layout.component.scss",
})
export class MainLayoutComponent {}
