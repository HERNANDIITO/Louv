import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { map } from "rxjs";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

    // Si ya hay un usuario en signals, evalúa inmediatamente
    if (authService.user()) {
      if (authService.isAuthenticated()&&!authService.isAdmin()) {
        return true;
      } else if (authService.isAuthenticated()) {
        router.navigate(["/"]);
        return false;
      } else {
        router.navigate(["/inicio-sesion"]);
        return false;
      }
    }
    
    // Si no hay usuario en signals, intenta refrescar la sesión
    return authService.tryRefresh().pipe(
      map(() => {
        if (authService.isAuthenticated()&&!authService.isAdmin()) {
            return true;
        } else if (authService.isAuthenticated()) {
            router.navigate(["/"]);
            return false;
        } else {
            router.navigate(["/inicio-sesion"]);
            return false;
        }
      })
    );
};
