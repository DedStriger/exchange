import ReactDOM from "react-dom/client";
import { App } from "./components";
import "./styles/index.scss";
import CoreContextProvider from "./core/CoreProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <CoreContextProvider>
    <App />
  </CoreContextProvider>
);
