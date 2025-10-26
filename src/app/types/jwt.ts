export interface CustomJwtPayload {
  sub: string;
  email: string;
  user_role: string;
  [key: string]: any;
}
