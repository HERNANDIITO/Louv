import { HttpContextToken } from "@angular/common/http";

export const USE_AUTH = new HttpContextToken<boolean>(() => true);
