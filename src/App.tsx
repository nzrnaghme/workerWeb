import { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.scss";
import "simplebar/dist/simplebar.min.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { GeneralContext } from "./Providers/GeneralContext";
import { IUserLogin } from "./Providers/Entities";
import { IConfirm } from "./Components/ConfirmPopup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Confirm from "./Components/ConfirmPopup";
import Route from "./Routers/routers";
import Header from "./Header/index";
import Footer from "./Footer/index";
import "simplebar/dist/simplebar.min.css";
import LoadingForm from "./Components/Loading";
import { toPersianNumber } from "./Components/hooks/persianHelper";
import InstallPWA from "./Components/InstallPWA";
import { isChrome, isIOS, isSafari } from "react-device-detect";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

function App() {
  const [userLogin, setUserLogin] = useState<IUserLogin>();
  const [confirm, setConfirm] = useState<IConfirm>({
    title: "",
    msg: "",
    confirmCallback: () => {},
    rejectCallback: () => {},
  });
  const [open, setOpen] = useState(false);

  //SnackBar
  let deferredPrompt: BeforeInstallPromptEvent | null = null;
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    let pwa = isPwa();
    if (
      pwa === false &&
      window.location.pathname === "/" &&
      (isChrome || (isSafari && isIOS))
    ) {
      setOpenSnackbar(true);
    }
  }, []);
  //end

  function isPwa() {
    let navigator: any = window.navigator;
    let isStandalone: boolean = navigator.standalone;
    let isAndroid = document.referrer.includes("android-app://");
    let isDisplay = ["fullscreen", "standalone", "minimal-ui"].some(
      (displayMode) =>
        window.matchMedia("(display-mode: " + displayMode + ")").matches
    );
    return isStandalone || isAndroid || isDisplay;
  }

  useEffect(() => {
    window.onstorage = (event) => {
      if (event.oldValue != null || event.newValue != null)
        window.location.reload();
    };
    VersionApp();
  }, []);


  //resume snackBar
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // This prevents default chrome prompt from appearing
    deferredPrompt = e as BeforeInstallPromptEvent;
  });

  const openInstall = () => {
    if (isIOS) return;
    deferredPrompt!.prompt();
  };

  const VersionApp = () => {
    const version = toPersianNumber(window.VERSION_CODE);
    const date = toPersianNumber(window.VERSION_DATE);
    console.log("نسخه", version, date);
  };

  const onConfirmSetter = (
    msg: string,
    confirmCallback: () => void,
    rejectCallback?: () => void,
    title?: string
  ) => setConfirm({ msg, confirmCallback, rejectCallback, title });

  return (
    <>
      <GeneralContext.Provider
        value={{
          userLogin,
          setUserLogin,
          confirmPopupOpen: open,
          setConfirmPopupOpen: setOpen,
          confirmTitle: confirm?.title,
          confirmMsg: confirm.msg,
          confirmCallback: confirm.confirmCallback,
          rejectCallback: confirm.rejectCallback,
          onConfirmSetter,
        }}
      >
        <InstallPWA
          openEx={openSnackbar}
          openInstall={() => {
            openInstall();
          }}
        />
        <ToastContainer
          position="top-center"
          autoClose={7000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={true}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Confirm />
        <LoadingForm />
        <Router>
          <Header />
          <Route />
          <Footer />
        </Router>
      </GeneralContext.Provider>
    </>
  );
}

export default App;
