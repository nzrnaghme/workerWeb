import ReactDOM from "react-dom";
import "./index.css";
import "./fonts/style.css";
import App from "./App";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import reportWebVitals from "./reportWebVitals";
import { StylesProvider, jssPreset } from "@material-ui/core/styles";
import rtl from "jss-rtl";
import { create } from "jss";
import { CookiesProvider } from "react-cookie";
import * as serviceWorker from "./serviceWorker";

const jss = create({
  plugins: [...jssPreset().plugins, rtl()],
  insertionPoint: "jss-insertion-point",
});

const theme = createTheme({
  typography: {
    fontFamily: "IRANSansX",
  },
  direction: "rtl",
  palette: {
    primary: { main: "#1976d2" },
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <StylesProvider jss={jss}>
      <div className="App" dir="rtl">
        <CookiesProvider>
          <App />
        </CookiesProvider>
      </div>
    </StylesProvider>
  </ThemeProvider>,
  document.getElementById("root")
);
// serviceWorker.register();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(//console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
serviceWorker.register();
