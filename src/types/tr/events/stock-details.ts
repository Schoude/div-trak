export interface StockDetailsEvent {
  isin: string;
  company: Company;
  similarStocks: SimilarStock[];
  dividends: Dividend[];
  totalDivendendCount: number;
  events: Event[];
  expectedDividend: Dividend | null;
  pastEvents: Event[];
  analystRating: AnalystRating;
  aggregatedDividends: AggregatedDividend[];
  dividendFrequency: string;
}

interface AggregatedDividend {
  periodStartDate: string;
  projected: boolean;
  yieldValue: number;
  amount: number;
  count: number;
  price: number;
}

export interface AnalystRating {
  targetPrice: TargetPrice;
  recommendations: Recommendations;
}

interface Recommendations {
  buy: number;
  outperform: number;
  hold: number;
  underperform: number;
  sell: number;
}

interface TargetPrice {
  average: number;
  high: number;
  low: number;
}

export interface Company {
  name: string;
  description: string;
  yearFounded: number;
  tickerSymbol: string;
  peRatioSnapshot: number;
  pbRatioSnapshot: number;
  dividendYieldSnapshot: number;
  earningsCall: null;
  marketCapSnapshot: number;
  dailyCloseYearSD: null;
  beta: number;
  countryCode: string;
  ceoName: string;
  cfoName: string;
  cooName: null;
  employeeCount: number;
  eps: number;
}

export interface Dividend {
  id: string;
  paymentDate: string;
  recordDate: string;
  exDate: string;
  amount: number;
  yield: null;
  type: DividendType;
}

export type DividendWithPayment = Dividend & {
  amountAtExDate: number;
  sourceTax: string | null;
  paymentAmount: string;
}

export interface CalendarDividend extends Pick<Dividend, 'id' | 'paymentDate' | 'recordDate' | 'exDate' | 'amount'> {
  amountFormatted: string;
  paymentDateTimestamp: number;
  amountOwned: number;
  sourceTax: number;
  sourceTaxFormatted: string;
  payment: number;
  paymentFormatted: string;
  isin: string;
  instrumentName: string;
}

export enum DividendType {
  Cash = 'cash',
  Unknown = 'unknown',
}

export interface Event {
  id: string;
  title: Title;
  timestamp: number;
  description: string;
  dividend: Dividend | null;
}

export enum Title {
  AnalystPresentation = 'Analyst  Presentation',
  Dividende = 'Dividende',
  EarningsCall = 'Earnings Call',
  FinancialsRelease = 'Financials Release',
  Hauptversammlung = 'Hauptversammlung',
}

interface SimilarStock {
  isin: string;
  name: string;
  tags: Tag[];
}

interface Tag {
  type: TagType;
  id: string;
  name: string;
  icon: string;
}

export enum TagType {
  Country = 'country',
  Sector = 'sector',
}
