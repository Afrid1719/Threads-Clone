import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import App from "./App.tsx";
import "./index.css";
import { StyleFunctionProps, mode } from "@chakra-ui/theme-tools";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";

const styles = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  global: (props: Record<string, any> | StyleFunctionProps) => ({
    body: {
      color: mode("gray.800", "whiteAlpha.900")(props),
      bg: mode("gray.100", "#101010")(props),
    },
  }),
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const colors = {
  gray: {
    light: "#616161",
    dark: "#1e1e1e",
  },
};

const theme = extendTheme({ config, styles, colors });

ReactDOM.createRoot(document.getElementById("root")!).render(
  // Reac.StrictMode renders every component twice in Development Env
  <React.StrictMode>
    <BrowserRouter>
      <RecoilRoot>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App />
        </ChakraProvider>
      </RecoilRoot>
    </BrowserRouter>
  </React.StrictMode>
);
