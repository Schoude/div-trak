import { array, nullable, number, object, picklist, string, type InferOutput } from 'valibot';

const Sentiment = ['Bearish', 'Bullish', 'Neutral', 'Somewhat-Bearish', 'Somewhat-Bullish'];

// START Sentiment News
const ArticleNewsSentimentSchema = object({
  title: string(),
  url: string(),
  time_published: string(),
  summary: string(),
  banner_image: nullable(string()),
  source: string(),
  source_domain: string(),
  overall_sentiment_score: number(),
  overall_sentiment_label: picklist(Sentiment),
  ticker_sentiment: array(object({
    ticker: string(),
    relevance_score: string(),
    ticker_sentiment_score: string(),
    ticker_sentiment_label: picklist(Sentiment),
  })),
  topics: array(object({
    topic: string(),
    relevance_score: string(),
  })),
});

export const NewsSentimentFeedSchema = array(ArticleNewsSentimentSchema);

export type ArticleNewsSentiment = InferOutput<typeof ArticleNewsSentimentSchema>;
// END Sentiment News

// START Top Gainers / Losers
const GainerOrLoser = object({
  ticker: string(),
  price: string(),
  change_amount: string(),
  change_percentage: string(),
  volume: string(),
});

export const TopGainersLosersSchema = object({
  top_gainers: array(GainerOrLoser),
  top_losers: array(GainerOrLoser),
});

export type TopGainersLosers = InferOutput<typeof TopGainersLosersSchema>;
// END Top Gainers / Losers

// START Overview Ticker
export const OverviewTickerSchema = object({
  Symbol: string(),
  Name: string(),
  Description: string(),
  Exchange: string(),
  Currency: string(),
  Country: string(),
  Sector: string(),
  Industry: string(),
  Address: string(),
  FiscalYearEnd: string(),
  LatestQuarter: string(),
  MarketCapitalization: string(),
  EBITDA: string(),
  PERatio: string(),
  PEGRatio: string(),
  BookValue: string(),
  DividendPerShare: string(),
  DividendYield: string(),
  EPS: string(),
  RevenuePerShareTTM: string(),
  ProfitMargin: string(),
  OperatingMarginTTM: string(),
  ReturnOnAssetsTTM: string(),
  ReturnOnEquityTTM: string(),
  RevenueTTM: string(),
  GrossProfitTTM: string(),
  DilutedEPSTTM: string(),
  QuarterlyEarningsGrowthYOY: string(),
  QuarterlyRevenueGrowthYOY: string(),
  AnalystTargetPrice: string(),
  TrailingPE: string(),
  ForwardPE: string(),
  PriceToSalesRatioTTM: string(),
  PriceToBookRatio: string(),
  EVToRevenue: string(),
  EVToEBITDA: string(),
  Beta: string(),
  '52WeekHigh': string(),
  '52WeekLow': string(),
  '50DayMovingAverage': string(),
  '200DayMovingAverage': string(),
  DividendDate: string(),
  ExDividendDate: string(),
});

export type OverviewTickerSchema = InferOutput<typeof OverviewTickerSchema>;
// END Overview Ticker

export const ALPHA_VANTAGE_FUNCTIONS = {
  NEWS_SENTIMENT: 'NEWS_SENTIMENT',
  TOP_GAINERS_LOSERS: 'TOP_GAINERS_LOSERS',
  OVERVIEW: 'OVERVIEW',
} as const;
