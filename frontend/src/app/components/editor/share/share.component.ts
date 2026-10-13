import { Component, effect, ElementRef, HostListener, inject, input, OnInit, output, signal, TemplateRef, ViewChild } from '@angular/core';
import { SwitchComponent } from "../../../shared/switch/switch.component";
import { BigSwitchComponent } from "../../../shared/big-switch/big-switch.component";
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { AlertHelper } from '../../../helpers/alerts.helper';
import { AuthService } from '../../../services/auth.service';
import { JewelService } from '../../../services/jewel.service';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-share',
  imports: [SwitchComponent, BigSwitchComponent, FaIconComponent],
  templateUrl: './share.component.html',
  styleUrl: './share.component.scss'
})
export class ShareComponent {

  initialPDFOrLink = input<boolean>(true);
  PDFOrLinkValue = signal<boolean>(this.initialPDFOrLink());

  showPriceValue = false;
  faCopy = faCopy;
  faCheck = faCheckCircle;

  shareLink = signal<string>("");

  jewelID = input<string | undefined>();
  toggler = input<HTMLElement>();

  justDownload = input<boolean>(false);
  downloadDone = output<void>();

  private jewelService = inject(JewelService);
  public authService = inject(AuthService);

  @ViewChild('flip') flip!: ElementRef<HTMLElement>;

  constructor(private elementRef: ElementRef) {
    effect(() => {
      const id = this.jewelID();

      if (!id) return;

      this.getShareLink();
      if ( this.justDownload() ) {
        this.downloadPDF();
        this.downloadDone.emit();
        return;
      }
    });

    effect(() => {
      this.initialPDFOrLink();
      this.PDFOrLinkValue.set(this.initialPDFOrLink());
    })
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target) || this.toggler()?.contains(event.target as Node)

    if (!clickedInside) {
      this.downloadDone.emit();
    }
  }

  PDFOrLink($event: boolean) {
    this.PDFOrLinkValue.set($event);
  }

  showPrice($event: boolean) {
    this.showPriceValue = $event;
    this.getShareLink();
  }

  getShareLink() {
    let hash;
    const baseUrl = window.location.origin + '/visor3d/';

    this.jewelService.shareJewel(this.jewelID()!, this.showPriceValue).subscribe((res: any) => {

      if (this.showPriceValue) {
        hash = res.shareHashWithPrice
      } else {
        hash = res.shareHashWithoutPrice
      }

      this.shareLink.set(`${baseUrl}${hash}`)
    })
  }

  copyLink() {
    navigator.clipboard.writeText(this.shareLink())
    this.flip.nativeElement.classList.add("flipped")
  }

  downloadPDF() {      // Si el usuario esta autenticado y tiene el diseno guardado, se le muestra el pdf
    this.jewelService.getMyJewelPDF(this.jewelID()!, this.showPriceValue).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      }
    });
  }

  onTransitionEnd(event: TransitionEvent) {
    setTimeout(() => {
      this.flip.nativeElement.classList.remove("flipped");
    }, 500);
  }

}
