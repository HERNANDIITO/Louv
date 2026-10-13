import {
  inject,
  Injectable,
  signal,
  computed,
  effect,
  NgZone,
} from "@angular/core";
import { HttpClient, HttpContext } from "@angular/common/http";
import {
  catchError,
  finalize,
  fromEvent,
  map,
  merge,
  Observable,
  of,
  shareReplay,
  Subscription,
  switchMap,
  tap,
  throttleTime,
} from "rxjs";
import { environment } from "../../environments/environment";
import { loginForm } from "../interfaces/login-form.model";
import { registerForm } from "../interfaces/register-form.model";
import { UserSafe } from "../interfaces/user.interface";
import { EmailCheckResponse } from "../interfaces/email-check-response.model";
import { Router } from "@angular/router";
import { USE_AUTH } from "../context/auth.context";
import { FORCE_JSON } from "../context/json.context";
import { EditJewelService } from "./editorServices/editJewel.service";

@Injectable({ providedIn: "root" })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private _user = signal<UserSafe | null>(null);
  user = this._user.asReadonly();
  private _isAuthenticated = signal<boolean>(false);
  isAuthenticated = this._isAuthenticated.asReadonly();
  private _isAdmin = signal<boolean>(false);
  isAdmin = this._isAdmin.asReadonly();
  private refreshSubscription$: Observable<any> | null = null;

  email = computed(() => this._user()?.email ?? null);
  name = computed(() => this._user()?.name ?? null);
  surname = computed(() => this._user()?.surname ?? null);
  totp = computed(() => this._user()?.totp?.enabled);

  private setAuthenticated(user: UserSafe) {
    this._user.set(user);
    this._isAuthenticated.set(true);
    this._isAdmin.set(user.permissions?.includes("admin") ?? false);
  }

  clearAuth() {
    this._user.set(null);
    this._isAuthenticated.set(false);
    this._isAdmin.set(false);
  }

  login(formData: loginForm) {
    return this.http.post(`${environment.apiUrl}/auth/login`, formData, {
      withCredentials: true,
      context: new HttpContext().set(USE_AUTH, true).set(FORCE_JSON, true),
    });
  }

  signUp(formData: registerForm) {
    return this.http.post(`${environment.apiUrl}/auth/register`, formData, {
      withCredentials: false,
      context: new HttpContext().set(USE_AUTH, false).set(FORCE_JSON, true),
    });
  }

  fetchMe() {
    return this.http
      .get<{ result: string; user: UserSafe }>(
        `${environment.apiUrl}/auth/me`,
        {
          withCredentials: true,
          context: new HttpContext().set(USE_AUTH, true),
        },
      )
      .pipe(
        map((response) => {
          const user = response.user;
          return {
            _id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            dni: user.dni,
            title: user.title,
            countryPrefix: user.countryPrefix,
            phone: user.phone,
            registrationDate: user.registrationDate,
            lastLogin: user.lastLogin,
            address: user.address,
            permissions: user.permissions,
            totp: user.totp ?? { enabled: false },
          };
        }),
        tap((userSafe) => {
          this.setAuthenticated(userSafe);
        }),
      );
  }

  tryRefresh() {
    // Si ya se está refrescando, devolvemos la misma "promesa" (observable)
    if (this.refreshSubscription$) {
      return this.refreshSubscription$;
    }

    this.refreshSubscription$ = this.http
      .post(
        `${environment.apiUrl}/auth/refresh`,
        {},
        {
          withCredentials: true,
          context: new HttpContext().set(USE_AUTH, false).set(FORCE_JSON, true),
        },
      )
      .pipe(
        switchMap(() => this.fetchMe()),
        // shareReplay(1) hace que si alguien más se suscribe, reciba el mismo resultado
        shareReplay(1),
        // Cuando termine (bien o mal), limpiamos la variable para permitir futuros refrescos
        finalize(() => {
          this.refreshSubscription$ = null;
        }),
        catchError(() => {
          this.clearAuth();
          return of(null);
        }),
      );

    return this.refreshSubscription$;
  }

  logout() {
    // 1. Limpiamos el estado LOCAL inmediatamente
    // Esto hace que la interfaz cambie al instante
    this.clearAuth();

    // 2. Intentamos avisar al servidor, pero de forma "desconectada"
    this.http
      .post(
        `${environment.apiUrl}/auth/logout`,
        {},
        {
          withCredentials: true,
          // IMPORTANTE: context con USE_AUTH false para que el interceptor no lo toque
          context: new HttpContext().set(USE_AUTH, false).set(FORCE_JSON, true),
        },
      )
      .pipe(
        // Pase lo que pase (error o éxito), redirigimos al inicio
        finalize(() => {
          this.router.navigate(["/"]);
          sessionStorage.removeItem("editor_jewel");
        }),
        // Capturamos el error para que no salga el mensaje rojo en consola
        catchError(() => of(null)),
      )
      .subscribe();
  }

  TOTPsetup() {
    return this.http.post(
      `${environment.apiUrl}/auth/totp/setup`,
      {},
      {
        withCredentials: true,
        context: new HttpContext().set(USE_AUTH, true).set(FORCE_JSON, true),
      },
    );
  }

  confirmTOTP(body: { totpCode: string }) {
    return this.http.post(`${environment.apiUrl}/auth/totp/confirm`, body, {
      withCredentials: true,
      context: new HttpContext().set(USE_AUTH, true).set(FORCE_JSON, true),
    });
  }

  verifyTOTP(body: { email: string; totpCode: string }) {
    return this.http.post(`${environment.apiUrl}/auth/totp`, body, {
      withCredentials: true,
      context: new HttpContext().set(USE_AUTH, true).set(FORCE_JSON, true),
    });
  }

  updateMe(updateData: Partial<UserSafe>) {
    return this.http.put<{ result: string; user: UserSafe }>(
      `${environment.apiUrl}/users/me`,
      updateData,
      {
        withCredentials: true,
        context: new HttpContext().set(USE_AUTH, true).set(FORCE_JSON, true),
      },
    );
  }

  checkUniqueEmail(email: string) {
    return this.http
      .post<EmailCheckResponse>(
        `${environment.apiUrl}/auth/check-email`,
        { email },
        {
          withCredentials: false,
          context: new HttpContext().set(USE_AUTH, false).set(FORCE_JSON, true),
        },
      )
      .pipe(
        map((res) => (res.exists ? { emailNotUnique: true } : null)),
        catchError(() => of(null)),
      );
  }

  changePassword(body: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) {
    return this.http.put(`${environment.apiUrl}/auth/password`, body, {
      withCredentials: true,
      context: new HttpContext().set(USE_AUTH, true).set(FORCE_JSON, true),
      observe: "response",
    });
  }
}
