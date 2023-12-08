interface Ticker {
  time: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: number;
  adjValue: string | null;
}

export interface AggregateHistory {
  aggregates: Ticker[];
  resolution: number;
  lastAggregateEndTime: number;
  expectedClosingTime: number;
}

export const aggregateHistory: AggregateHistory = {
  'expectedClosingTime': 1702072800000,
  'aggregates': [
      {
          'time': 1702017000000,
          'open': '54.94',
          'high': '55.37',
          'low': '54.94',
          'close': '55.37',
          'volume': 0,
          'adjValue': '55.37'
      },
      {
          'time': 1702017600000,
          'open': '55.37',
          'high': '55.45',
          'low': '55.34',
          'close': '55.45',
          'volume': 0,
          'adjValue': '55.45'
      },
      {
          'time': 1702018200000,
          'open': '55.45',
          'high': '55.46',
          'low': '55.38',
          'close': '55.39',
          'volume': 0,
          'adjValue': '55.39'
      },
      {
          'time': 1702018800000,
          'open': '55.39',
          'high': '55.4',
          'low': '55.24',
          'close': '55.32',
          'volume': 0,
          'adjValue': '55.32'
      },
      {
          'time': 1702019400000,
          'open': '55.32',
          'high': '55.37',
          'low': '55.2',
          'close': '55.31',
          'volume': 0,
          'adjValue': '55.31'
      },
      {
          'time': 1702020000000,
          'open': '55.31',
          'high': '55.35',
          'low': '55.31',
          'close': '55.35',
          'volume': 0,
          'adjValue': '55.35'
      },
      {
          'time': 1702020600000,
          'open': '55.42',
          'high': '55.43',
          'low': '55.34',
          'close': '55.34',
          'volume': 0,
          'adjValue': '55.34'
      },
      {
          'time': 1702021200000,
          'open': '55.23',
          'high': '55.42',
          'low': '55.23',
          'close': '55.41',
          'volume': 0,
          'adjValue': '55.41'
      },
      {
          'time': 1702021800000,
          'open': '55.42',
          'high': '55.42',
          'low': '55.41',
          'close': '55.41',
          'volume': 0,
          'adjValue': '55.41'
      },
      {
          'time': 1702022400000,
          'open': '55.41',
          'high': '55.41',
          'low': '55.38',
          'close': '55.38',
          'volume': 0,
          'adjValue': '55.38'
      },
      {
          'time': 1702023000000,
          'open': '55.38',
          'high': '55.38',
          'low': '55.37',
          'close': '55.38',
          'volume': 0,
          'adjValue': '55.38'
      },
      {
          'time': 1702023600000,
          'open': '55.36',
          'high': '55.37',
          'low': '55.33',
          'close': '55.36',
          'volume': 0,
          'adjValue': '55.36'
      },
      {
          'time': 1702024200000,
          'open': '55.36',
          'high': '55.39',
          'low': '55.36',
          'close': '55.39',
          'volume': 0,
          'adjValue': '55.39'
      },
      {
          'time': 1702024800000,
          'open': '55.39',
          'high': '55.43',
          'low': '55.38',
          'close': '55.38',
          'volume': 0,
          'adjValue': '55.38'
      },
      {
          'time': 1702025400000,
          'open': '55.39',
          'high': '55.5',
          'low': '55.15',
          'close': '55.22',
          'volume': 0,
          'adjValue': '55.22'
      },
      {
          'time': 1702026000000,
          'open': '55.55',
          'high': '55.74',
          'low': '55.44',
          'close': '55.66',
          'volume': 0,
          'adjValue': '55.66'
      },
      {
          'time': 1702026600000,
          'open': '55.66',
          'high': '55.73',
          'low': '55.56',
          'close': '55.68',
          'volume': 0,
          'adjValue': '55.68'
      },
      {
          'time': 1702027200000,
          'open': '55.68',
          'high': '55.69',
          'low': '55.67',
          'close': '55.67',
          'volume': 0,
          'adjValue': '55.67'
      },
      {
          'time': 1702027800000,
          'open': '55.54',
          'high': '55.72',
          'low': '55.53',
          'close': '55.72',
          'volume': 0,
          'adjValue': '55.72'
      },
      {
          'time': 1702028400000,
          'open': '55.73',
          'high': '55.73',
          'low': '55.73',
          'close': '55.73',
          'volume': 0,
          'adjValue': '55.73'
      },
      {
          'time': 1702029000000,
          'open': '55.73',
          'high': '55.8',
          'low': '55.58',
          'close': '55.73',
          'volume': 0,
          'adjValue': '55.73'
      },
      {
          'time': 1702029600000,
          'open': '55.73',
          'high': '55.73',
          'low': '55.7',
          'close': '55.73',
          'volume': 0,
          'adjValue': '55.73'
      },
      {
          'time': 1702030200000,
          'open': '55.73',
          'high': '55.73',
          'low': '55.67',
          'close': '55.7',
          'volume': 0,
          'adjValue': '55.7'
      },
      {
          'time': 1702030800000,
          'open': '55.71',
          'high': '55.72',
          'low': '55.57',
          'close': '55.71',
          'volume': 0,
          'adjValue': '55.71'
      },
      {
          'time': 1702031400000,
          'open': '55.71',
          'high': '55.71',
          'low': '55.71',
          'close': '55.71',
          'volume': 0,
          'adjValue': '55.71'
      },
      {
          'time': 1702032000000,
          'open': '55.71',
          'high': '55.71',
          'low': '55.7',
          'close': '55.71',
          'volume': 0,
          'adjValue': '55.71'
      },
      {
          'time': 1702032600000,
          'open': '55.7',
          'high': '55.71',
          'low': '55.68',
          'close': '55.71',
          'volume': 0,
          'adjValue': '55.71'
      },
      {
          'time': 1702033200000,
          'open': '55.7',
          'high': '55.71',
          'low': '55.7',
          'close': '55.7',
          'volume': 0,
          'adjValue': '55.7'
      },
      {
          'time': 1702033800000,
          'open': '55.7',
          'high': '55.71',
          'low': '55.7',
          'close': '55.71',
          'volume': 0,
          'adjValue': '55.71'
      },
      {
          'time': 1702034400000,
          'open': '55.7',
          'high': '55.71',
          'low': '55.68',
          'close': '55.71',
          'volume': 0,
          'adjValue': '55.71'
      },
      {
          'time': 1702035000000,
          'open': '55.68',
          'high': '55.71',
          'low': '55.68',
          'close': '55.71',
          'volume': 0,
          'adjValue': '55.71'
      },
      {
          'time': 1702035600000,
          'open': '55.71',
          'high': '55.73',
          'low': '55.71',
          'close': '55.73',
          'volume': 0,
          'adjValue': '55.73'
      },
      {
          'time': 1702036200000,
          'open': '55.73',
          'high': '55.73',
          'low': '55.73',
          'close': '55.73',
          'volume': 0,
          'adjValue': '55.73'
      },
      {
          'time': 1702036800000,
          'open': '55.73',
          'high': '55.75',
          'low': '55.43',
          'close': '55.43',
          'volume': 0,
          'adjValue': '55.43'
      },
      {
          'time': 1702037400000,
          'open': '55.43',
          'high': '55.44',
          'low': '55.43',
          'close': '55.44',
          'volume': 0,
          'adjValue': '55.44'
      },
      {
          'time': 1702038000000,
          'open': '55.43',
          'high': '55.44',
          'low': '55.43',
          'close': '55.44',
          'volume': 0,
          'adjValue': '55.44'
      },
      {
          'time': 1702038600000,
          'open': '55.43',
          'high': '55.45',
          'low': '55.42',
          'close': '55.44',
          'volume': 0,
          'adjValue': '55.44'
      },
      {
          'time': 1702039200000,
          'open': '55.43',
          'high': '55.46',
          'low': '55.43',
          'close': '55.46',
          'volume': 0,
          'adjValue': '55.46'
      },
      {
          'time': 1702039800000,
          'open': '55.46',
          'high': '55.65',
          'low': '55.45',
          'close': '55.65',
          'volume': 0,
          'adjValue': '55.65'
      },
      {
          'time': 1702040400000,
          'open': '55.66',
          'high': '55.66',
          'low': '55.64',
          'close': '55.65',
          'volume': 0,
          'adjValue': '55.65'
      },
      {
          'time': 1702041000000,
          'open': '55.65',
          'high': '55.7',
          'low': '55.65',
          'close': '55.67',
          'volume': 0,
          'adjValue': '55.67'
      },
      {
          'time': 1702041600000,
          'open': '55.67',
          'high': '55.7',
          'low': '55.67',
          'close': '55.68',
          'volume': 0,
          'adjValue': '55.68'
      },
      {
          'time': 1702042200000,
          'open': '55.69',
          'high': '55.78',
          'low': '55.54',
          'close': '55.61',
          'volume': 0,
          'adjValue': '55.61'
      },
      {
          'time': 1702042800000,
          'open': '55.6',
          'high': '55.72',
          'low': '55.56',
          'close': '55.7',
          'volume': 0,
          'adjValue': '55.7'
      },
      {
          'time': 1702043400000,
          'open': '55.69',
          'high': '55.71',
          'low': '55.68',
          'close': '55.71',
          'volume': 0,
          'adjValue': '55.71'
      },
      {
          'time': 1702044000000,
          'open': '55.71',
          'high': '55.71',
          'low': '55.58',
          'close': '55.71',
          'volume': 0,
          'adjValue': '55.71'
      },
      {
          'time': 1702044600000,
          'open': '55.72',
          'high': '55.77',
          'low': '55.64',
          'close': '55.71',
          'volume': 0,
          'adjValue': '55.71'
      },
      {
          'time': 1702045200000,
          'open': '55.65',
          'high': '55.72',
          'low': '55.4',
          'close': '55.53',
          'volume': 0,
          'adjValue': '55.53'
      },
      {
          'time': 1702045800000,
          'open': '55.56',
          'high': '55.7',
          'low': '54.99',
          'close': '55.55',
          'volume': 0,
          'adjValue': '55.55'
      },
      {
          'time': 1702046400000,
          'open': '55.54',
          'high': '55.71',
          'low': '55.3',
          'close': '55.47',
          'volume': 0,
          'adjValue': '55.47'
      },
      {
          'time': 1702047000000,
          'open': '55.33',
          'high': '55.44',
          'low': '55.33',
          'close': '55.38',
          'volume': 0,
          'adjValue': '55.38'
      },
      {
          'time': 1702047600000,
          'open': '55.41',
          'high': '55.55',
          'low': '55.2',
          'close': '55.22',
          'volume': 0,
          'adjValue': '55.22'
      },
      {
          'time': 1702048200000,
          'open': '55.23',
          'high': '55.41',
          'low': '55.16',
          'close': '55.29',
          'volume': 0,
          'adjValue': '55.29'
      },
      {
          'time': 1702048800000,
          'open': '55.28',
          'high': '55.28',
          'low': '55.28',
          'close': '55.28',
          'volume': 0,
          'adjValue': null
      }
  ],
  'resolution': 600000,
  'lastAggregateEndTime': 1702048800000
};