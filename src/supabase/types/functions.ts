import type { User } from '@/types/auth';

export interface UserDataReturnType {
  user: User;
  token: string;
}
