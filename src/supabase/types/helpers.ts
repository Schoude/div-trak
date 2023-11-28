import type { PostgrestError } from '@supabase/supabase-js';
import type { Database } from './database';

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }>
  ? Exclude<U, null>
  : never;
export type DbResultErr = PostgrestError;

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

export type ORDER_EXECUTION_TYPE = Enums<'order_execution_type'>;

export type Portfolio = Pick<Tables<'portfolios'>, 'id' | 'name'> & {
  isins: string[];
  orders: Order[];
};

export type Order = Pick<
  Tables<'orders'>,
  | 'isin'
  | 'amount'
  | 'year'
  | 'month'
  | 'day'
  | 'executed_at'
  | 'execution_type'
>;

export type OrderNew = Pick<
  Tables<'orders'>,
  | 'isin'
  | 'amount'
  | 'year'
  | 'month'
  | 'day'
  | 'executed_at'
  | 'execution_type'
  | 'portfolio_id'
>;
