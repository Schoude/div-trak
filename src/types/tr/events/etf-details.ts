export interface ETFDetailsEvent {
  isin: string;
  wkn: string;
  name: string;
  inceptionDate: string;
  domicile: string;
  replicationMethod: string;
  rebalancingInterval: string;
  totalExpenseRatio: number;
  underlyingIndex: string;
  distributionFrequency: string;
  distributionPolicy: string;
  type: string;
  issuer: string;
  composition: Composition[];
  totalCompositionCount: number;
  focus: string[];
  exposure: Exposure;
  metrics: Metrics;
  distributions: Distribution[];
  totalDistributionCount: number;
  aggregatedDistributions: AggregatedDistribution[];
}

export interface AggregatedDistribution {
  periodStartDate: string;
  projected: boolean;
  yieldValue: number;
  amount: number;
  count: number;
  projectedCount: number | null;
  price: number;
}

export interface Composition {
  isin: string;
  name: string;
  marketValue: number;
  holdingPercent: number;
  tags: CountryExposure[];
  tradable: boolean;
}

export interface CountryExposure {
  type: Type;
  id: string;
  name: string;
  icon: string;
  weightage?: number;
}

type SectorExposure = CountryExposure;

export enum Type {
  Country = 'country',
  Sector = 'sector',
}

export interface Distribution {
  paymentDate: string;
  recordDate: string;
  exDate: string;
  amount: number;
}

export interface Exposure {
  sectorExposure: SectorExposure[];
  countryExposure: CountryExposure[];
  currencyExposure: CurrencyExposure;
}

export interface CurrencyExposure {
  EUR: number;
  GBP: number;
  USD: number;
}

export interface Metrics {
  peRatio: number | null;
  pbRatio: number | null;
  yield: number | null;
  assetsUnderManagement: number | null;
  beta: number | null;
  deviation: number | null;
}
