import { observer } from "mobx-react-lite";
import styles from "./Address.module.scss";
import { useCore } from "../../hooks";
import { ExchangeStatus } from "../../core/Exchange/Exchange";

export default observer(function Address() {
  const {
    exchange: { address, setAddress, error, status, doExchange },
  } = useCore();
  return (
    <div className={styles.container}>
      <label htmlFor="address" className={styles.label}>
        Your Ethereum address
      </label>
      <div className={styles.body}>
        <input
          type="text"
          name="address"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={styles.input}
        />
        <div className={styles.btn__container}>
          <button
            className={styles.btn}
            onClick={doExchange}
            data-success={status === ExchangeStatus.Success}
            disabled={!!error || status === ExchangeStatus.Proccess}
          >
            {status === ExchangeStatus.Success ? "Success" : "Exchange"}
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>
    </div>
  );
});
