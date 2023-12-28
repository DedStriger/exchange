import { observer } from "mobx-react-lite";
import styles from "./SelectInput.module.scss";
import { Currency } from "../../core/RestClient/types";
import { ChevronDown } from "../../assets";
import CurrencyList from "../CurrencyList/CurrencyList";
import { useRef, useState } from "react";
import { useClickOutside } from "../../hooks";

export type SelectInputProps = {
  activeCurrency: Currency | undefined;
  setCurrency: (v: Currency) => void;
  setAmount?: (v: string) => void;
  amount: string;
  disabled?: boolean;
};

export default observer(function SelectInput(props: SelectInputProps) {
  const { activeCurrency, setCurrency, setAmount, amount, disabled } = props;
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setShow(false), show);
  return (
    <div className={styles.container}>
      <input
        type="text"
        value={amount}
        className={styles.input}
        disabled={disabled}
        onChange={(e) => setAmount?.(e.target.value)}
      />
      <div
        className={styles.active}
        ref={ref}
        onClick={() => setShow((prev) => !prev)}
      >
        <img src={activeCurrency?.image} alt={`Icon ${activeCurrency?.name}`} />
        <div className={styles.active__name}>{activeCurrency?.ticker}</div>
        <ChevronDown />
      </div>
      {show && (
        <CurrencyList
          setShow={setShow}
          setCurrency={setCurrency}
          excludeCurrency={activeCurrency?.ticker}
        />
      )}
    </div>
  );
});
