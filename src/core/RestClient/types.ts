export type Currency = {
  ticker: string;
  name: string;
  image: string;
  hasExternalId: boolean;
  isFiat: boolean;
  featured: boolean;
  isStable: boolean;
  supportsFixedRate: boolean;
};

export type GetAllCurrencyResponse = Currency[];
export type GetPairsResponse = string[];

export type GetMinAmountResponse = {
  minAmount: number;
};

export type GetExchangeAmount = {
  estimatedAmount: number;
  error?: string;
  transactionSpeedForecast: string;
};

export type CreateExchangeRequest = {
  from: string;
  to: string;
  address: string;
  amount: string;
  extraId?: string;
  userId?: string;
  contactEmail?: string;
  refundAddress?: string;
  refundExtraId?: string;
};

export type CreateExchangeResponse = {
  payinAddress: string;
  payoutAddress: string;
  payoutExtraId?: string;
  fromCurrency: string;
  toCurrency: string;
  refundAddress?: string;
  refundExtraId?: string;
  id: string;
  amount: number;
};
