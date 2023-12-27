import { action, makeObservable, observable } from "mobx";
import RestClient from "../RestClient/RestClient";
import { Currency } from "../RestClient/types";

export enum ExchangeStatus {
  Load,
  Ready,
  Error,
}

export default class Exchange {
  @observable private _currencies: Currency[] = [];
  @observable private _pairs: string[] = [];
  @observable private _status = ExchangeStatus.Load;
  @observable private _from = "0";
  @observable private _to = "0";
  @observable private _toCurrency: Currency | undefined;
  @observable private _fromCurrency: Currency | undefined;
  constructor(
    protected readonly _root: {
      readonly restClient: RestClient;
    }
  ) {
    makeObservable(this);
  }
  get currencies() {
    return this._currencies;
  }

  get pairs() {
    return this._pairs;
  }

  get status() {
    return this._status;
  }

  get toCurrency() {
    return this._toCurrency;
  }

  @action.bound
  setToCurrency(v: Currency) {
    this._toCurrency = v;
  }

  get fromCurrency() {
    return this._fromCurrency;
  }

  @action.bound
  setFromCurrency(v: Currency) {
    this._fromCurrency = v;
  }

  get from() {
    return this._from;
  }

  @action.bound
  setFrom(v: string) {
    this._from = v;
  }

  get to() {
    return this._to;
  }

  @action.bound
  setTo(v: string) {
    this._to = v;
  }
  @action.bound
  private async _getCurrency() {
    try {
      const currency = await this._root.restClient.getCurrency();
      this._currencies = currency;
      this._fromCurrency = currency[0];
      this._toCurrency = currency[1];
    } catch (e: any) {
      throw new Error(e || "fail get currency");
    }
  }

  @action.bound
  private async _getPairs() {
    try {
      const pairs = await this._root.restClient.getAllPairs();
      this._pairs = pairs;
    } catch (e: any) {
      throw new Error(e || "fail get pairs");
    }
  }
  @action.bound
  async init() {
    try {
      await Promise.allSettled([this._getCurrency(), this._getPairs()]);
      this._status = ExchangeStatus.Ready;
    } catch {
      this._status = ExchangeStatus.Error;
    }
  }
}
