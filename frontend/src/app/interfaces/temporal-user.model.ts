export interface TemporalUser {
  id: string;
  name: string;
  surname: string;
  email: string;
  registrationDate: Date;
  lastLogin: Date;
  completeAccount: boolean;
}
