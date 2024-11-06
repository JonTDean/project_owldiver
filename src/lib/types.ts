export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface LayoutData {
  user: AuthUser | null;
}

export interface ErrorData {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export type ActionResult = 
  | { type: 'success'; data?: { message: string } }
  | { type: 'failure'; data?: { message: string } }
  | { type: 'redirect'; location: string }
  | { type: 'error'; error: ErrorData };

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export type Status = 'active' | 'inactive' | 'pending';