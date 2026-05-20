export interface Rates {
  [currency: string]: number;
}

// Using Frankfurter API which is free, open-source, and requires no API key.
// It is published by the European Central Bank.
export async function getExchangeRates(): Promise<Rates | null> {
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=USD');
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    return data.rates;
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    return null;
  }
}
