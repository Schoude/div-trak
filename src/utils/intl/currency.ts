interface NumberFormatOptions {
  style?: 'decimal' | 'currency';
  currency?: string;
  maximumFractionDigits: number;
  roundingMode: 'ceil';
}

export function formatNumber (
  value: number,
  options: {
    style: 'decimal' | 'currency',
    currency?: 'EUR' | 'USD',
    roundingMode?: 'ceil' | 'floor',
  } = { roundingMode:'ceil', style: 'currency' },
) {
  const formatOptions: NumberFormatOptions = {
    style: options.style,
    maximumFractionDigits: 2,
    roundingMode: 'ceil',
  };

  if (options.currency) {
    formatOptions.currency = options.currency;
  }

  return new Intl.NumberFormat('de-DE', formatOptions)
    .format(value);
}
