export interface NeonSearchEvent {
  results: NeonSearchResults;
  resultCount: number;
  correlationId: string;
}

export type NeonSearchResults = StockSearchResult[] | ETFSearchResult[];

interface BaseSearchResult {
  isin: string;
  name: string;
  tags: Tag[];
  type: string;
  derivativeProductCategories: string[];
  imageId: string;
}

export type StockSearchResult = BaseSearchResult;

export interface Tag {
  type: string;
  id: string;
  name: string;
}

export interface ETFSearchResult extends BaseSearchResult {
  subtitle: string;
  mappedEtfIndexName: string;
  etfDescription: string;
}
