import { ChangeDetectionStrategy, Component } from "@angular/core";
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: "app-showcase-section",
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: "./showcase-section.component.html",
  styleUrl: "./showcase-section.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowcaseSectionComponent {}
