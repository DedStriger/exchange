import { PropsWithChildren, createContext, useEffect } from "react";
import Core from "./Core";
import { runInAction } from "mobx";

export const CoreContext = createContext<Core | null>(null);

export default function CoreContextProvider(props: PropsWithChildren) {
  const core = new Core();

  useEffect(() => {
    runInAction(() => !core.initialized && core.init());
  }, []);

  return (
    <CoreContext.Provider value={core}>{props.children}</CoreContext.Provider>
  );
}
