import { jwtDecode } from 'jwt-decode';

export function isTokenExpired(token: string): boolean {
  if (!token) return true;
  const { exp } = jwtDecode(token);
  return Date.now() >= exp * 1000;
}