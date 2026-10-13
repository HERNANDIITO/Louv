import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-initial-video",
  standalone: true,
  imports: [],
  templateUrl: "./initial-video.component.html",
  styleUrl: "./initial-video.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InitialVideoComponent {
  beenClicked = false;
}
