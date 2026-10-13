import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, NgZone, ViewChild } from "@angular/core";
import { RouterLink } from "@angular/router";
import { EngineComponent } from "../../../shared/engine/engine.component";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: "app-initial-section",
  imports: [FontAwesomeModule, RouterLink, FaIconComponent],
  templateUrl: "./initial-section.component.html",
  styleUrl: "./initial-section.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InitialSectionComponent {
  faAngleRight = faAngleRight;
  @ViewChild('videoPlayer') video!: ElementRef<HTMLVideoElement>;

  constructor(private zone: NgZone) { }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      const vid = this.video.nativeElement;
      // this.video.nativeElement.playbackRate = 0.62;
      vid.muted = true;
      vid.play();
    });
  }

  scrollTo() {
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  }
}
