import { Injectable } from "@angular/core";
import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { FORCE_JSON } from "../context/json.context";

@Injectable()
export class JsonContentTypeInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (!req.context.get(FORCE_JSON)) {
      return next.handle(req);
    }

    return next.handle(
      req.clone({
        headers: req.headers.set("Content-Type", "application/json"),
      }),
    );
  }
}
