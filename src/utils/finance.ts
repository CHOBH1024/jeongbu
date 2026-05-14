/**
 * Financial Calculation Utilities
 */

/**
 * PMT (Payment) calculation
 * @param rate - monthly interest rate
 * @param nper - total number of payments
 * @param pv - present value (principal)
 */
export const calculatePMT = (rate: number, nper: number, pv: number): number => {
  if (rate === 0) return pv / nper;
  return (pv * rate * Math.pow(1 + rate, nper)) / (Math.pow(1 + rate, nper) - 1);
};

/**
 * Calculate total interest for a loan
 */
export const calculateTotalInterest = (principal: number, rate: number, years: number): number => {
  const monthlyRate = rate / 100 / 12;
  const payments = years * 12;
  const pmt = calculatePMT(monthlyRate, payments, principal);
  return (pmt * payments) - principal;
};

/**
 * Korean Progressive Tax Rate (Simplified for 2024/2025)
 * Returns the estimated tax amount for a given annual income
 */
export const calculateKoreanTax = (annualIncome: number): number => {
  // Simplified tax brackets
  const brackets = [
    { limit: 14000000, rate: 0.06, deduction: 0 },
    { limit: 50000000, rate: 0.15, deduction: 1260000 },
    { limit: 88000000, rate: 0.24, deduction: 5760000 },
    { limit: 150000000, rate: 0.35, deduction: 15440000 },
    { limit: 300000000, rate: 0.38, deduction: 19940000 },
    { limit: 500000000, rate: 0.40, deduction: 25940000 },
    { limit: 1000000000, rate: 0.42, deduction: 35940000 },
    { limit: Infinity, rate: 0.45, deduction: 65940000 },
  ];

  for (let i = 0; i < brackets.length; i++) {
    if (annualIncome <= brackets[i].limit) {
      return (annualIncome * brackets[i].rate) - brackets[i].deduction;
    }
  }
  return 0;
};

/**
 * Future Value (FV) with compound interest
 */
export const calculateFV = (pv: number, rate: number, nper: number, pmt: number = 0): number => {
  const monthlyRate = rate / 100 / 12;
  const fv = pv * Math.pow(1 + monthlyRate, nper) + 
             pmt * ((Math.pow(1 + monthlyRate, nper) - 1) / monthlyRate);
  return fv;
};

/**
 * Formatting helpers
 */
export const formatCurrency = (amount: number, unit: string = '원'): string => {
  return new Intl.NumberFormat('ko-KR').format(Math.floor(amount)) + unit;
};
