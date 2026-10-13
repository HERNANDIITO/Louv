import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieConsentService } from '../../services/cookie-consent.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cookie-banner.component.html',
  styleUrl: './cookie-banner.component.scss'
})
export class CookieBannerComponent implements OnInit, OnDestroy {

  show = false;
  private sub!: Subscription;

  constructor(private consentService: CookieConsentService) {}

  ngOnInit(): void {
    this.show = !this.consentService.hasConsent();

     this.sub = this.consentService.showBanner$
      .subscribe(show => this.show = show);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  acceptAll() {
    this.consentService.acceptAll();
    this.show = false;
  }

  rejectAll() {
    this.consentService.rejectAll();
    this.show = false;
  }

  openSettings() {
    // Placeholder para el futuro
    alert('Configuración de cookies (pendiente)');
  }

}
