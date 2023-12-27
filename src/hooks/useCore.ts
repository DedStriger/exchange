import { CoreContext } from "../core/CoreProvider";
import { useContext } from "react";

export const useCore = () => {
  const core = useContext(CoreContext);

  if (!core) {
    throw new Error("`useCore` has to be used within <CoreContext.Provider>");
  }

  return core;
};
