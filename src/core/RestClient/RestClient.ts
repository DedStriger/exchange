import HTTPTransport from "../Http";
import { GetAllCurrencyResponse, GetPairsResponse } from "./types";

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
}
