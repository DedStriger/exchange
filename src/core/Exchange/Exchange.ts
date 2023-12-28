import { action, makeObservable, observable, runInAction } from "mobx";
import RestClient from "../RestClient/RestClient";
import { Currency } from "../RestClient/types";
import { debounce } from "../../utils/debounce";
type KindAction = "_from" | "_to";

export enum ExchangeStatus {
  Load,
  Proccess,
  Ready,
  Error,
  Success,
}

export default class Exchange {
  @observable private _currencies: Currency[] = [];
  @observable private _pairs: string[] = [];
  @observable private _status = ExchangeStatus.Load;
  @observable private _min = 0;
  @observable private _from = "0";
  @observable private _to = "0";
  @observable private _toCurrency: Currency | undefined;
  @observable private _fromCurrency: Currency | undefined;
  @observable private _address: string = "";
  @observable private _error: string | undefined;
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

  get error() {
    return this._error;
  }

  get address() {
    return this._address;
  }

  @action.bound
  setAddress(v: string) {
    this._error = undefined;
    this._address = v;
  }

  get status() {
    return this._status;
  }

  get toCurrency() {
    return this._toCurrency;
  }

  @action.bound
  setToCurrency(v: Currency) {
    this._error = undefined;
    this._toCurrency = v;
    this._refresh("_from");
  }

  get fromCurrency() {
    return this._fromCurrency;
  }

  @action.bound
  setFromCurrency(v: Currency) {
    this._error = undefined;
    this._fromCurrency = v;
    this._refresh("_from");
  }

  @action.bound
  swap() {
    const to = this._to,
      from = this._from,
      toCurrency = this._toCurrency,
      fromCurrency = this._fromCurrency;
    this._to = from;
    this._from = to;
    this._toCurrency = fromCurrency;
    this._fromCurrency = toCurrency;
    this._refresh("_from");
  }

  get from() {
    return this._from;
  }

  @action.bound
  setFrom(v: string) {
    this._from = v;
    this._debouncedRefresh("_from", true);
  }

  get to() {
    return this._to;
  }

  @action.bound
  setTo(v: string) {
    this._to = v;
  }

  @action.bound
  async doExchange() {
    if (
      this._status === ExchangeStatus.Proccess ||
      this._checkErrorForExchange()
    ) {
      return;
    }
    this._status = ExchangeStatus.Proccess;
    try {
      const response = await this._root.restClient.createExchange({
        from: this._fromCurrency!.ticker,
        to: this._toCurrency!.ticker,
        address: this._address,
        amount: this._to,
      });
      this._address = "";
      this._status = ExchangeStatus.Success;
      setTimeout(() => {
        runInAction(() => (this._status = ExchangeStatus.Ready));
      }, 2000);
    } catch (e: any) {
      this._status = ExchangeStatus.Ready;
      this._error = e.message || e.error;
    }
  }

  @action.bound
  private async _getCurrency() {
    try {
      const currency = await this._root.restClient.getCurrency();
      this._currencies = currency;
      this._fromCurrency = currency[0];
      this._toCurrency = currency[1];
      await this._refresh("_from");
    } catch (e: any) {
      throw new Error(e || "fail get currency");
    }
  }

  @action.bound
  private async _getEstimated(kind: KindAction) {
    try {
      const params = {
        from:
          kind === "_from"
            ? this._fromCurrency!.ticker
            : this._toCurrency!.ticker,
        to:
          kind === "_from"
            ? this._toCurrency!.ticker
            : this._fromCurrency!.ticker,
      };
      if (!this._checkPair(params.from, params.to)) {
        return;
      }
      const estimated = await this._root.restClient.getExchangeAmount(
        params.from,
        params.to,
        this[kind]
      );
      if (!estimated.estimatedAmount) {
        this._error = "this pair is disabled now";
        return;
      }
      const resp = `${estimated.estimatedAmount}`;
      if (kind === "_from") {
        this._to = resp;
      }

      if (kind === "_to") {
        this._from = resp;
      }
    } catch (e: any) {
      this._error = e.message || e.error;
    }
  }

  @action.bound
  private async _getMin(kind: KindAction) {
    const from =
      kind === "_from" ? this._fromCurrency!.ticker : this._toCurrency!.ticker;
    const to =
      kind === "_from" ? this._toCurrency!.ticker : this._fromCurrency!.ticker;
    if (!this._checkPair(from, to)) {
      return;
    }
    const min = await this._root.restClient.getMinAmount(from, to);
    this._min = min.minAmount;
    if (+this[kind] < min.minAmount) {
      this[kind] = `${min.minAmount}`;
    }
    return min.minAmount;
  }

  @action.bound
  private _refresh = async (kind: KindAction, noMinRequest?: boolean) => {
    this._error = undefined;
    runInAction(() => (this._status = ExchangeStatus.Proccess));
    if (!noMinRequest) {
      await this._getMin(kind);
    }
    await this._getEstimated(kind);
    runInAction(() => (this._status = ExchangeStatus.Ready));
  };

  private _debouncedRefresh = debounce(this._refresh);

  private _checkPair(from: string, to: string) {
    const condition =
      this._pairs.length > 0 ? this._pairs.includes(`${from}_${to}`) : true;
    if (!condition) {
      this._error = "this pair is disabled now";
    }

    return condition;
  }

  @action.bound
  private async _getPairs() {
    try {
      const pairs = await this._root.restClient.getAllPairs();
      this._pairs = pairs;
    } catch (e: any) {
      this._error = e.error;
      throw new Error(e || "fail get pairs");
    }
  }

  @action.bound
  private _checkErrorForExchange() {
    if (+this._from < this._min) {
      this._error = "to small amount";
      return true;
    }

    if (!this._address) {
      this._error = "address is required";
      return true;
    }
    return false;
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
