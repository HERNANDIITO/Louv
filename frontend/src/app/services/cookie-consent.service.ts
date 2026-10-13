// cookie-consent.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

//export type ConsentValue = 'accepted' | 'rejected';

@Injectable({ providedIn: 'root' })
export class CookieConsentService {

  private COOKIE_NAME = 'cookieConsent';

  private showBannerSubject = new BehaviorSubject<boolean>(
    !this.hasConsent() 
  );

  showBanner$ = this.showBannerSubject.asObservable();

  hasConsent(): boolean {
    return this.getCookie(this.COOKIE_NAME) !== null;
  }

  openBanner(): void {
    this.showBannerSubject.next(true);
  }

  closeBanner(): void {
    this.showBannerSubject.next(false);
  }

  acceptAll(): void {
    this.setCookie(this.COOKIE_NAME, 'accepted', 365);
    this.closeBanner();
  }

  rejectAll(): void {
    this.setCookie(this.COOKIE_NAME, 'rejected', 365);
    this.closeBanner();
  }

  private setCookie(name: string, value: string, days: number) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Strict; Secure;`;
  }

  private getCookie(name: string): string | null {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='))
      ?.split('=')[1] || null;
  }
}
