import { ALPHA_VANTAGE_FUNCTIONS, NewsSentimentFeedSchema } from '@/types/alphavantage';
import { parse } from 'valibot';

export function useAlphaVantageStore () {
  function getAlphavantageDate (date: string) {
    const parts = date.split('');
    parts.splice(4, 0, '-');
    parts.splice(7, 0, '-');
    parts.splice(13, 0, ':');
    parts.splice(16, 0, ':');
    parts.push('.540Z');

    return new Date(parts.join(''));
  }

  function createAlphavantageDate (monthsAgo: number): string {
    const currentDate = new Date();

    // Calculate the date in the past
    currentDate.setMonth(currentDate.getMonth() - monthsAgo);

    // Extract year, month, and day
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, so we add 1
    const day = currentDate.getDate().toString().padStart(2, '0');

    // Format the date as 'YYYYMMDDTHHMM'
    const formattedDate = `${year}${month}${day}T0000`;

    return formattedDate;
  }

  async function getSentimentNews () {
    const topics = 'earnings,finance,manufacturing,technology';
    const topicsQuery = `&topics=${topics}`;
    const sorting = 'LATEST';
    const limit = '30';
    const timeFrom = `time_from=${createAlphavantageDate(1)}`;
    const res = await fetch(`${import.meta.env.VITE_ALPHA_VANTAGE_API_URL}${ALPHA_VANTAGE_FUNCTIONS.NEWS_SENTIMENT}&sort=${sorting}&limit=${limit}${topicsQuery}&${timeFrom}&apikey=${import.meta.env.ALPHA_VANTAGE_API_TOKEN}`);

    if (!res.ok) {
      throw new Error('Could not fetch AlphaVantage Sentiment News');
    }

    const json = await res.json();

    if ('Note' in json || 'Information' in json) {
      throw new Error(`API Quote Reached: ${json['Note'] ?? json['Information']}`);
    }

    try {
      const parsed = parse(NewsSentimentFeedSchema, json.feed);

      const articlesBullish = parsed
        .filter(article => article.overall_sentiment_score >= .15)
        .sort((a, b) => b.overall_sentiment_score - a.overall_sentiment_score);

      const articlesBearish = parsed
        .filter(article => article.overall_sentiment_score <= -.15)
        .sort((a, b) => a.overall_sentiment_score - b.overall_sentiment_score);

      return {
        articlesBullish,
        articlesBearish,
      };
    } catch (error) {
      console.error(error);
    }
  }

  return {
    getSentimentNews,
    getAlphavantageDate,
  };
}
