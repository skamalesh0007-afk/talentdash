// Conversion rates (base: INR)
export const CONVERSION_RATES: Record<string, number> = {
  INR: 1,
  USD: 0.012,   // 1 INR = 0.012 USD
  GBP: 0.0095,
  EUR: 0.011,
};

export function convertToINR(amount: number, currency: string): number {
  const rate = CONVERSION_RATES[currency] ?? 1;
  return Math.round(amount / rate);
}

export function convertFromINR(amountINR: number, targetCurrency: string): number {
  const rate = CONVERSION_RATES[targetCurrency] ?? 1;
  return Math.round(amountINR * rate);
}

export function formatCurrency(amount: number, currency: string): string {
  if (currency === 'INR') {
    return formatINR(amount);
  }
  const symbol = currency === 'USD' ? '$' : currency === 'GBP' ? '£' : '€';
  if (amount >= 10000000) return `${symbol}${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `${symbol}${(amount / 100000).toFixed(1)}L`;
  return `${symbol}${amount.toLocaleString()}`;
}

export function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatSalaryDisplay(amount: number, fromCurrency: string, displayCurrency: string): string {
  const inr = convertToINR(amount, fromCurrency);
  const converted = convertFromINR(inr, displayCurrency);
  return formatCurrency(converted, displayCurrency);
}
