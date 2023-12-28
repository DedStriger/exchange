import { observer } from "mobx-react-lite";
import styles from "./Loader.module.scss";
import { useCore } from "../../hooks";
import { ExchangeStatus } from "../../core/Exchange/Exchange";

export default observer(function Loader() {
  const {
    exchange: { status },
  } = useCore();
  if (![ExchangeStatus.Error, ExchangeStatus.Load].includes(status)) {
    return null;
  }
  return (
    <div className={styles.container}>
      {status === ExchangeStatus.Load && <div className={styles.loader} />}
      {status === ExchangeStatus.Error && (
        <div className={styles.text}>Oppsss.....</div>
      )}
    </div>
  );
});
