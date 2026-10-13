import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { faGem, faHandshake, faMagicWandSparkles, faPalette } from "@fortawesome/free-solid-svg-icons";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";

@Component({
  selector: "app-initial-explanation",
  imports: [RouterLink, FaIconComponent],
  templateUrl: "./initial-explanation.component.html",
  styleUrl: "./initial-explanation.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InitialExplanationComponent {
  icons = {
    faMagicWandSparkles,
    faPalette,
    faHandshake,
    faGem
  }
}
