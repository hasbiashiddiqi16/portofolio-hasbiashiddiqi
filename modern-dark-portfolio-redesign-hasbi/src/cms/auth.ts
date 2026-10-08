const PASSWORD_KEY = "hasbi-portfolio-cms-password";
const SESSION_KEY = "hasbi-portfolio-cms-session";
const DEFAULT_PASSWORD = "admin123";

export function getPassword(): string {
  return window.localStorage.getItem(PASSWORD_KEY) ?? DEFAULT_PASSWORD;
}

export function setPassword(password: string): void {
  window.localStorage.setItem(PASSWORD_KEY, password);
}

export function isAuthenticated(): boolean {
  return window.sessionStorage.getItem(SESSION_KEY) === "1";
}

export function login(password: string): boolean {
  if (password !== getPassword()) return false;
  window.sessionStorage.setItem(SESSION_KEY, "1");
  return true;
}

export function logout(): void {
  window.sessionStorage.removeItem(SESSION_KEY);
}
