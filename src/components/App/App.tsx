import { observer } from "mobx-react-lite";
import { SwapSvg } from "../../assets";
import { useCore } from "../../hooks";
import SelectInput from "../SelectInput/SelectInput";
import styles from "./App.module.scss";
import Loader from "../Loader/Loader";
import Address from "../Address/Address";

function App() {
  const {
    exchange: {
      from,
      fromCurrency,
      to,
      toCurrency,
      setToCurrency,
      setFrom,
      setFromCurrency,
      swap,
    },
  } = useCore();
  return (
    <main className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Crypto Exchange</h1>
        <p className={styles.subtitle}>Exchange fast and easy</p>
        <div className={styles.swap}>
          <SelectInput
            activeCurrency={fromCurrency}
            setCurrency={setFromCurrency}
            amount={from}
            setAmount={setFrom}
          />
          <SwapSvg className={styles.swap__icon} onClick={swap} />
          <SelectInput
            activeCurrency={toCurrency}
            setCurrency={setToCurrency}
            amount={to}
            disabled
          />
        </div>
        <Address />
      </div>
      <Loader />
    </main>
  );
}

export default observer(App);
