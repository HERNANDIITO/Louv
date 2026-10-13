import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private apiUrl = `${environment.apiUrl}/events/track`;

  constructor(private http: HttpClient) {}

  private getSource(): string {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source');
    const referrer = document.referrer.toLowerCase();

    if (utmSource) return utmSource.toLowerCase();

    if (referrer.includes('google')) return 'google';
    if (referrer.includes('wordpress')) return 'wordpress';
    if (referrer.includes('instagram')) return 'instagram';
    if (referrer.includes('facebook') || referrer.includes('fb.me')) return 'facebook';
    if (referrer.includes('tiktok')) return 'tiktok';

    return 'direct';
  }

    private getOrCreateAnonymousId(): string {
        let anonId = localStorage.getItem('anonymousId');
        if (!anonId) {
            anonId = 'anon_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
            localStorage.setItem('anonymousId', anonId);
        }
        return anonId;
    }

    public postEvent(eventType: string, metadata: any = {}) {

        const isAdmin = localStorage.getItem('isAdmin') === 'true'; 
        if (isAdmin) return;
        const storedUserId = localStorage.getItem('userId');
        
        const cleanUserId = (storedUserId && storedUserId !== 'undefined' && storedUserId !== 'null') 
            ? storedUserId 
            : null;

        const body = {
            eventType: eventType,
            userId: cleanUserId,
            metadata: metadata || {},
            anonymousId: this.getOrCreateAnonymousId()
        };

        this.http.post(this.apiUrl, body).subscribe();
        /* 
        this.http.post(this.apiUrl, body).subscribe({
            error: (err) => console.error('Tracking Error:', err)
        });
        */
    }

    trackPageView() {
        const pageViewDone = sessionStorage.getItem('pv_done');
        if (pageViewDone) return;

        const sourceTracked = sessionStorage.getItem('source_tracked');
        const hasVisitedBefore = localStorage.getItem('v_known');

        let metadata: any = {};

        if (!sourceTracked) {
            metadata.source = this.getSource();
            sessionStorage.setItem('source_tracked', 'true');
        }
        
        if (hasVisitedBefore) {
            this.postEvent('return_visit', metadata);
        } else {
            localStorage.setItem('v_known', 'true');
            this.postEvent('page_view', metadata);
        }

        sessionStorage.setItem('pv_done', 'true');
    }

    trackActiveSession() {
        const activeDone = sessionStorage.getItem('active_done');
        if (activeDone) return;

        this.postEvent('active_session');

        sessionStorage.setItem('active_done', 'true');
    }

    trackEditorAccess() {
        this.postEvent('editor_access');
    }

}