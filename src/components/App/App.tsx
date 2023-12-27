import { observer } from "mobx-react-lite";
import { SwapSvg } from "../../assets";
import { useCore } from "../../hooks";
import SelectInput from "../SelectInput/SelectInput";
import styles from "./App.module.scss";
import Loader from "../Loader/Loader";

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
      setTo,
    },
  } = useCore();
  return (
    <main className={styles.wrapper}>
      <form className={styles.container}>
        <h1 className={styles.title}>Crypto Exchange</h1>
        <p className={styles.subtitle}>Exchange fast and easy</p>
        <div className={styles.swap}>
          <SelectInput
            activeCurrency={fromCurrency}
            setCurrency={setFromCurrency}
            amount={from}
            setAmount={setFrom}
          />
          <SwapSvg className={styles.swap__icon} />
          <SelectInput
            activeCurrency={toCurrency}
            setCurrency={setToCurrency}
            amount={to}
            setAmount={setTo}
          />
        </div>
      </form>
      <Loader />
    </main>
  );
}

export default observer(App);
