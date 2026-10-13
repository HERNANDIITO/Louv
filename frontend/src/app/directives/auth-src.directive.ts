import { Directive, Input, ElementRef, inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { USE_AUTH } from '../context/auth.context';

@Directive({
  selector: 'img[authSrc]', // Se aplica a cualquier <img> que tenga el atributo authSrc
  standalone: true
})
export class AuthSrcDirective implements OnDestroy {
  private el = inject(ElementRef);
  private http = inject(HttpClient);
  private currentObjectURL: string | null = null;

  @Input() set authSrc(url: string | null | undefined) {
    if (!url) {
      this.el.nativeElement.src = 'assets/images/placeholder.png';
      return;
    }
    this.loadImage(url);
  }

  /**
   * @description
   * Directiva encargada de cargar imágenes que requieren autenticación mediante HttpClient.
   * 
   * Esta directiva utiliza el motor de peticiones
   * de Angular para incluir automáticamente tokens de seguridad, cookies de sesión (withCredentials)
   * y gestionar el refresco de tokens a través de los interceptores.
   * 
   */
  private loadImage(url: string) {
    // Limpiar la imagen anterior si existía para no fugar memoria
    this.revoke();

    // Hacer la petición con seguridad
    this.http.get(url, { 
      responseType: 'blob',
      withCredentials: true,
      context: new HttpContext().set(USE_AUTH, true) 
    }).subscribe({
      next: (blob) => {
        this.currentObjectURL = URL.createObjectURL(blob);
        this.el.nativeElement.src = this.currentObjectURL;
      },
      error: () => {
        this.el.nativeElement.src = 'images/placeholder.image.png';
      }
    });
  }

  private revoke() {
    if (this.currentObjectURL) {
      URL.revokeObjectURL(this.currentObjectURL);
      this.currentObjectURL = null;
    }
  }

  ngOnDestroy() {
    this.revoke(); // Limpieza absoluta al destruir el componente
  }
}