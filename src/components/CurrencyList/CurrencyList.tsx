import { observer } from "mobx-react-lite";
import styles from "./CurrencyList.module.scss";
import { Currency } from "../../core/RestClient/types";
import { useCore } from "../../hooks";
import { useCallback, useMemo } from "react";

export type CurrencyListProps = {
  excludeCurrency?: string;
  setCurrency: (v: Currency) => void;
  setShow: (v: boolean) => void;
};

export default observer(function CurrencyList(props: CurrencyListProps) {
  const {
    exchange: { currencies },
  } = useCore();
  const {excludeCurrency, setCurrency, setShow} = props;
  const list = useMemo(() => currencies.filter(c => c.ticker !== excludeCurrency), [currencies, excludeCurrency])
  const set = useCallback((c: Currency) => {
    setCurrency(c)
    setShow(false)
  }, [setCurrency, setShow])
  return (
    <div className={styles.container}>
      {list.map((c) => (
        <div className={styles.item} key={c.ticker} onClick={() => set(c)}>
          <img src={c.image} />
          <span className={styles.short_name}>{c.ticker}</span>
          <span className={styles.name}>{c.name}</span>
        </div>
      ))}
    </div>
  );
});
