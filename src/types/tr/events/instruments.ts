export interface InstrumentEvent {
  exchangeIds: string[];
  dividends: any[];
  splits: Split[];
  name: string;
  typeId: string;
  isin: string;
  shortName: string;
  intlSymbol: string;
  tags: Tag[];
  company: Company;
  marketCap: MarketCap;
  lastDividend: null;
  fundInfo: null;
  imageId: string;
  description: string | null;
}

interface Company {
  name: string;
  description: null;
  ipoDate: number;
  countryOfOrigin: string;
}

interface MarketCap {
  value: string;
}

interface Split {
  id: string;
  date: number;
  initial: number;
  final: number;
}

export interface Tag {
  type: string;
  id: string;
  name: string;
  icon: string;
}
