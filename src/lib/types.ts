export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: Date;
}

declare global {
  namespace App {
    interface Locals {
      user: User | null;
    }
  }
} 