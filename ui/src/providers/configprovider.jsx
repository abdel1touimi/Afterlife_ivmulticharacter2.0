import { createContext, useContext, useEffect, useState } from "react";
import { nuicallback } from "../utils/nuicallback";
import { defaultConfig } from "./configDefaults";

const ConfigCtx = createContext(null);

const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(defaultConfig);

  useEffect(() => {
    if (!import.meta.env.DEV) {
      nuicallback("getConfig").then((data) => data && setConfig(data));
    }
  }, []);

  return (
    <ConfigCtx.Provider value={{ config, setConfig }}>
      {children}
    </ConfigCtx.Provider>
  );
};

export default ConfigProvider;

export const useConfig = () => useContext(ConfigCtx);
