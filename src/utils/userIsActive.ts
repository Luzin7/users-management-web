export function isActive(lastLoginAt: string): boolean{
  const lastLoginDate = new Date(lastLoginAt);
  const now = new Date();
  const diffInMs = now.getTime() - lastLoginDate.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  return diffInDays <= 30;
}