import { observer } from "mobx-react-lite";
import styles from "./SelectInput.module.scss";
import { Currency } from "../../core/RestClient/types";
import { ChevronDown } from "../../assets";

export type SelectInputProps = {
  activeCurrency: Currency | undefined;
  setCurrency: (v: Currency) => void;
  setAmount: (v: string) => void;
  amount: string;
};

export default observer(function SelectInput(props: SelectInputProps) {
  const { activeCurrency, setCurrency, setAmount, amount } = props;
  return (
    <div className={styles.container}>
      <input
        type="text"
        value={amount}
        className={styles.input}
        onChange={(e) => setAmount(e.target.value)}
      />
      <div className={styles.active}>
        <img src={activeCurrency?.image} alt={`Icon ${activeCurrency?.name}`} />
        <div className={styles.active__name}>{activeCurrency?.ticker}</div>
        <ChevronDown />
      </div>
    </div>
  );
});
