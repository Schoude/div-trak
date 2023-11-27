interface NumberFormatOptions {
  style?: 'decimal' | 'currency';
  currency?: string;
  maximumFractionDigits: number;
  roundingMode: 'floor';
}

export function formatNumber (value: number, style: 'decimal' | 'currency', currency?: 'EUR' | 'USD') {
  const options: NumberFormatOptions = {
    style,
    maximumFractionDigits: 2,
    roundingMode: 'floor',
  };

  if (currency) {
    options.currency = currency;
  }

  return new Intl.NumberFormat('de-DE', options)
    .format(value);
}
