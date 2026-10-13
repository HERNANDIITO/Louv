import { Injectable, inject } from "@angular/core";
import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";
import { USE_AUTH } from "../context/auth.context";

@Injectable()
export class AuthRefreshInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private isRefreshing = false; 
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const useAuth = req.context.get(USE_AUTH);

    if (!useAuth) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      catchError((err) => {
        // Si el error no es 401, o es la propia ruta de refresh que ha fallado
        if (err.status !== 401) {
          return throwError(() => err);
        }
        const isAuthRoute = req.url.includes("/auth/refresh") || 
                        req.url.includes("/auth/login") || 
                        req.url.includes("/auth/logout") ||
                        req.url.includes("/auth/totp"); // Añade todas tus rutas de auth
        
        if (isAuthRoute) {
          this.authService.clearAuth();
          return throwError(() => err);
        }

        if (this.isRefreshing) {
          // --- CASO A: Ya se está refrescando el token ---
          // Hacemos que esta petición se quede esperando hasta que el "buzón" tenga un valor
          return this.refreshTokenSubject.pipe(
            filter(result => result !== null), // Espera a que el valor sea distinto de null
            take(1),                           // Solo nos interesa el primer aviso
            switchMap(() => next.handle(req))  // Reintenta la petición original
          );
        } else {
          // --- CASO B: Somos la primera petición en detectar el 401 ---
          this.isRefreshing = true;
          this.refreshTokenSubject.next(null); // Limpiamos el buzón

          return this.authService.tryRefresh().pipe(
            switchMap((user) => {
              this.isRefreshing = false;
              this.refreshTokenSubject.next(user || false); // Avisamos a todos los que esperan
              return next.handle(req);             // Reintentamos nuestra propia petición
            }),
            catchError((refreshErr) => {
              this.isRefreshing = false;
              // Si hay un error de red, también desbloqueamos la cola enviando 'false'
              this.refreshTokenSubject.next(false);
              this.authService.logout();           // Si el refresh falla, sesión cerrada
              return throwError(() => refreshErr);
            })
          );
        }
      })
    );
  }
}
