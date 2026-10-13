export interface User {
    _id: string;
    name: string;
    email: string;
}

export interface Address {
  street: string;
  extraInfo?: string;
  postalCode: string;
  locality: string;
  province: string;
  country: string;
}


export interface UserSafe {
  _id: string;
  name: string;
  surname: string;
  email: string;

  password?: string;
  salt?: string;

  dni?: string;
  title?: string;
  countryPrefix?: string;
  phone?: string;

  registrationDate?: string;
  lastLogin?: string;

  address?: Address;
  completeAccount?: boolean;

  permissions?: string[];
  totp?: { enabled:boolean };
}
  