/**
 * 별의별 계산기 — 법정 요율 · 상한액 중앙 관리
 * 변경 시 이 파일만 수정하면 모든 계산기에 즉시 반영됩니다.
 * 마지막 업데이트: 2025-01-01
 */

export const RATES_EFFECTIVE_DATE = '2025년 1월 기준';

/* ── 최저임금 ────────────────────────────────────────────── */
export const MINIMUM_WAGE = {
  hourly: 10030,       // 시간급 (2024년)
  daily: 80240,        // 일급 (8시간 기준)
  monthly: 2096270,    // 월급 환산 (209시간)
};

/* ── 4대보험 요율 (근로자 부담분) ───────────────────────── */
export const INSURANCE_RATES = {
  nationalPension:    0.045,   // 국민연금 4.5%
  healthInsurance:    0.03545, // 건강보험 3.545%
  longTermCare:       0.1295,  // 장기요양보험 (건강보험료의 12.95%)
  employmentInsurance: 0.009,  // 고용보험 0.9%
};

/* ── 4대보험 요율 (사업자 부담분) ───────────────────────── */
export const EMPLOYER_RATES = {
  nationalPension:     0.045,  // 국민연금 4.5%
  healthInsurance:     0.03545,// 건강보험 3.545%
  longTermCare:        0.1295, // 장기요양보험
  employmentInsurance: 0.009,  // 고용보험 0.9% (150인 미만)
  industrialAccident:  0.007,  // 산재보험 (업종평균 0.7%)
};

/* ── 실업급여 ────────────────────────────────────────────── */
export const UNEMPLOYMENT = {
  rateOfWage:     0.60,   // 평균임금의 60%
  maxDailyBenefit: 66000, // 상한액 (2024년)
  minDailyBenefit: 63104, // 하한액 (최저임금의 80%)
  /* 소정급여일수 (피보험단위기간 기준) */
  benefitDays: {
    under50: {
      under12m: 120, under36m: 150, under60m: 180, under120m: 210, over120m: 240,
    },
    over50: {
      under12m: 120, under36m: 180, under60m: 210, under120m: 240, over120m: 270,
    },
  },
};

/* ── 육아휴직급여 ────────────────────────────────────────── */
export const PARENTAL_LEAVE = {
  first3Month: { rate: 0.80, min: 700000, max: 1500000 },
  after3Month: { rate: 0.50, min: 700000, max: 1200000 },
  dadBonus:    { rate: 1.00, min: 700000, max: 2500000 }, // 아빠의 달 첫 달
};

/* ── 퇴직소득세 근속연수 공제 (근로소득세법 §48) ─────────── */
export const SEVERANCE_TENURE_DEDUCTION: Array<{ maxYears: number; deductPerYear: number; base: number }> = [
  { maxYears:  5, deductPerYear: 300000, base: 0 },
  { maxYears: 10, deductPerYear: 500000, base: 1500000 },
  { maxYears: 20, deductPerYear: 800000, base: 4000000 },
  { maxYears: Infinity, deductPerYear: 1200000, base: 12000000 },
];

/* ── 환산급여 공제 (퇴직소득세법) ───────────────────────── */
export const SEVERANCE_INCOME_DEDUCTION: Array<{ maxIncome: number; rate: number; base: number }> = [
  { maxIncome:  8000000, rate: 1.00, base: 0 },
  { maxIncome: 17000000, rate: 0.60, base: 8000000 },
  { maxIncome: 30000000, rate: 0.55, base: 14200000 },
  { maxIncome: 45000000, rate: 0.45, base: 23650000 },
  { maxIncome: 87000000, rate: 0.35, base: 32500000 },
  { maxIncome: Infinity, rate: 0.25, base: 57400000 },
];

/* ── 종합소득세 세율 ─────────────────────────────────────── */
export const INCOME_TAX_BRACKETS = [
  { max: 14000000,   rate: 0.06, deduct: 0 },
  { max: 50000000,   rate: 0.15, deduct: 1260000 },
  { max: 88000000,   rate: 0.24, deduct: 5760000 },
  { max: 150000000,  rate: 0.35, deduct: 15440000 },
  { max: 300000000,  rate: 0.38, deduct: 19940000 },
  { max: 500000000,  rate: 0.40, deduct: 25940000 },
  { max: 1000000000, rate: 0.42, deduct: 35940000 },
  { max: Infinity,   rate: 0.45, deduct: 65940000 },
];

/* ── 주택 청약 가점 ─────────────────────────────────────── */
export const HOUSING_SUBSCRIPTION = {
  homelessYears: [0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32],
  dependents:    [5,10,15,20,25,30,35],
  savingsMonths: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],
};

/* ── 부동산 취득세 (지방세법) ───────────────────────────── */
export const ACQUISITION_TAX = {
  under85m2: [
    { maxPrice: 600000000,  rate: 0.01, title: '1% (6억 이하)' },
    { maxPrice: 900000000,  rate: 0.02, title: '2% (6~9억)' },
    { maxPrice: Infinity,   rate: 0.03, title: '3% (9억 초과)' },
  ],
  over85m2: [{ maxPrice: Infinity, rate: 0.03, title: '3%' }],
};

/* ── 임대차 중개보수 상한 ────────────────────────────────── */
export const BROKER_FEE_RATES = {
  rent: [
    { max: 50000000,  rate: 0.005, limit: 200000,  label: '5천만원 미만' },
    { max: 100000000, rate: 0.004, limit: 300000,  label: '1억원 미만' },
    { max: 300000000, rate: 0.003, limit: null,    label: '3억원 미만' },
    { max: 600000000, rate: 0.004, limit: null,    label: '6억원 미만' },
    { max: Infinity,  rate: 0.008, limit: null,    label: '6억원 이상' },
  ],
  sale: [
    { max: 50000000,  rate: 0.006, limit: 200000,  label: '5천만원 미만' },
    { max: 200000000, rate: 0.005, limit: 800000,  label: '2억원 미만' },
    { max: 600000000, rate: 0.004, limit: null,    label: '6억원 미만' },
    { max: 900000000, rate: 0.005, limit: null,    label: '9억원 미만' },
    { max: Infinity,  rate: 0.009, limit: null,    label: '9억원 이상' },
  ],
};
