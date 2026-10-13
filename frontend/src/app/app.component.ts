import { Component, inject, OnInit, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { filter, map, mergeMap } from "rxjs";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faComment, faX } from '@fortawesome/free-solid-svg-icons';

import { AuthService } from "./services/auth.service";
import { SeoService } from "./services/seo.service";
import { GoogleAnalyticsService } from "./services/google-analytics.service";
import { AppChatbotComponent } from "./shared/chatbot/chatbot.component";
import { CookieBannerComponent } from './shared/cookie-banner/cookie-banner.component';
import { TrackingService } from "./services/tracking.service";

@Component({
    selector: "app-root",
    imports: [RouterOutlet, AppChatbotComponent, CookieBannerComponent, FontAwesomeModule],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent implements OnInit {
    protected title = "louv";
    private authService = inject(AuthService);
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private seoService = inject(SeoService);
    private googleAnalyticsService = inject(GoogleAnalyticsService);
    private trackingService = inject(TrackingService);
    private hasTrackedSession = false;
    isChatVisible = false;
    faComment = faComment;
    faCross = faX
    toggleChat() {
        this.isChatVisible = !this.isChatVisible;
    }

    constructor() {}


    isEditor3d(): boolean {
        return (this.router.url.includes('/editor3d') && !this.router.url.includes('/editor3d-old'));
    }

    /**
     * Inicializa la validación del token de autenticación y actualiza las metaetiquetas
     * y el título de la página según los datos de la ruta.
     */
    ngOnInit() {
        this.authService.tryRefresh().subscribe();

        const isAdminPath = window.location.pathname.includes('/admin');
        if (isAdminPath) return;

         //Registrar visitas + usuario activo
        if (!this.hasTrackedSession) {
            // Registro de visita inmediata
            this.trackingService.trackPageView();
            // Registro UA (+10s)
            setTimeout(() => {
                this.trackingService.trackActiveSession();
            }, 10000);

            this.hasTrackedSession = true;
        }
        
        // Actualizar el título y las metaetiquetas en la navegación usando los datos de la ruta
        this.router.events.pipe(
            filter((e) => e instanceof NavigationEnd),
            map(() => {
                let route = this.activatedRoute;
                // Buscamos el último hijo activo
                while (route.firstChild) {
                    route = route.firstChild;
                }
                return route;
            }),
            // Aseguramos que solo procesamos si la ruta tiene datos
            filter((route) => route.outlet === 'primary'),
            mergeMap((route) => route.data)
        ).subscribe((data: any) => {
            const title = data?.title as string | undefined;
            const description = data?.description as string | undefined;
            const indexable = data?.indexable as boolean | undefined;
            const url = window.location.origin + this.router.url;
            this.seoService.setTitleAndMeta({ title, description, url, indexable });
            this.googleAnalyticsService.trackPage(this.router.url, title);
        });
    }
}
