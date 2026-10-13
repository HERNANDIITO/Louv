import { HttpContextToken } from '@angular/common/http';

export const FORCE_JSON = new HttpContextToken<boolean>(() => false);
