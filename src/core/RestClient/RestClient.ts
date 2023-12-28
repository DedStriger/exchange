import HTTPTransport from "../Http";
import {
  CreateExchangeRequest,
  CreateExchangeResponse,
  GetAllCurrencyResponse,
  GetExchangeAmount,
  GetMinAmountResponse,
  GetPairsResponse,
} from "./types";

export default class RestClient {
  constructor(
    protected readonly _root: {
      readonly http: HTTPTransport;
    }
  ) {}

  getCurrency(): Promise<GetAllCurrencyResponse> {
    return this._root.http.get({
      url: "v1/currencies",
      params: { active: "true" },
    });
  }

  getAllPairs(): Promise<GetPairsResponse> {
    return this._root.http.get({ url: "v1/market-info/available-pairs/" });
  }

  getMinAmount(from: string, to: string): Promise<GetMinAmountResponse> {
    return this._root.http.get({ url: `v1/min-amount/${from}_${to}` });
  }

  getExchangeAmount(
    from: string,
    to: string,
    amount: string
  ): Promise<GetExchangeAmount> {
    return this._root.http.get({
      url: `v1/exchange-amount/${amount}/${from}_${to}`,
    });
  }

  createExchange(
    params: CreateExchangeRequest
  ): Promise<CreateExchangeResponse> {
    return this._root.http.post({
      url: "v1/transactions",
      body: params,
      withApiKey: true,
    });
  }
}
