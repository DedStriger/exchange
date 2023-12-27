import Exchange from "./Exchange/Exchange";
import HTTPTransport from "./Http";
import RestClient from "./RestClient/RestClient";

export default class Core {
  initialized = false;
  readonly http = new HTTPTransport();
  readonly restClient = new RestClient(this);
    readonly exchange = new Exchange(this);
  async init() {
    await this.exchange.init();
    this.initialized = true;
  }
}
