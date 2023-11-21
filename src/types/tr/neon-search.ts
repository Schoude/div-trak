export interface ReturnValueNeonSearch {
  eventId: number;
  jsonObject: JSONObject;
}

export interface JSONObject {
  results: StockSearchResult[] | ETFSearchResult[];
  resultCount: number;
  correlationId: string;
}

interface BaseSearchResult {
  isin: string;
  name: string;
  tags: Tag[];
  type: string;
  derivativeProductCategories: string[];
  imageId: string;
}

type StockSearchResult = BaseSearchResult;

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
