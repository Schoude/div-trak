import type { User } from '@/types/auth';
import type { Dividend } from '@/types/tr/events/stock-details';

export interface UserDataReturnType {
  user: User;
  token: string;
}

export interface DividendsCrawlReturnType {
  estimatedDividends: Dividend[];
}
