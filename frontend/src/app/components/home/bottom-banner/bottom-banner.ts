import { ChangeDetectionStrategy, Component } from "@angular/core";
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: "app-bottom-banner",
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: "./bottom-banner.component.html",
  styleUrl: "./bottom-banner.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BottomBannerComponent {}
