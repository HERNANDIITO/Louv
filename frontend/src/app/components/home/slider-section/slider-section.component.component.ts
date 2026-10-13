import { ChangeDetectionStrategy, Component } from "@angular/core";
import { SliderComponent } from "./slider/slider.component";

@Component({
  selector: "app-slider-section",
  standalone: true,
  imports: [SliderComponent],
  templateUrl: "./slider-section.component.html",
  styleUrl: "./slider-section.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderSectionComponent {}
