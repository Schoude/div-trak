import type { PostgrestError } from '@supabase/supabase-js';
import type { Enums, Tables } from './database';

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }>
  ? Exclude<U, null>
  : never;
export type DbResultErr = PostgrestError;

export type ORDER_EXECUTION_TYPE = Enums<'order_execution_type'>;

export type Portfolio = Pick<Tables<'portfolios'>, 'id' | 'name'> & {
  isins: string[];
  orders: Order[];
};

export type Order = Pick<
  Tables<'orders'>,
  | 'id'
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
