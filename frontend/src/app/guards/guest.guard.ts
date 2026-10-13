import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { map } from "rxjs";

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

    if (authService.user()) {
        if (!authService.isAuthenticated()) {
            //No autenticado, puede acceder a login o registro
            return true;
        } else {
            router.navigate(["/"]);
            return false;
        }
    }
      
      // Si no hay usuario en signals, intenta refrescar la sesión
      return authService.tryRefresh().pipe(
        map(() => {
            if (!authService.isAuthenticated()) {
                //No autenticado, puede acceder a login o registro
                return true;
            } else {
                router.navigate(["/"]);
                return false;
            }
        })
      );
};
