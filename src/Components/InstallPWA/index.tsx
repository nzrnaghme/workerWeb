import React, { useEffect, useState } from "react";
import "./index.scss";
import Button from "../Button";
import Popup from "../Popup";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { isAndroid, isChrome, isIOS, isSafari } from "react-device-detect";
import shareIconIOS from "./img/share.svg";
import addIconIOS from "./img/add.svg";

type props = {
  openEx: boolean;
  openInstall: () => void;
};

export default function InstallPWA({ openEx, openInstall }: props) {
  const [open, setOpen] = useState(false);
  const matchesSm = useMediaQuery("(max-width:40rem)");

  useEffect(() => {
    if (openEx) handleClick();
  }, [openEx]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleOpen = () => {
    setOpen(false);
    openInstall();
  };

  return (
    <>
      {matchesSm && window.location.pathname === "/" && (
        <Popup
          open={open}
          onClose={() => {
            setOpen(true);
          }}
          className="all-form-pop-up-install-pwa"
        >
          <div className="pop-up-install-pwa">
            {isIOS && isSafari && (
              <div className="ios-saffari-title-pwa">
                <div className="ios-saffari-share">
                  <img src={shareIconIOS} className="share-icon" />
                  <p style={{ marginTop: "10px" }}>
                    در قسمت پایین روی دکمه
                    <strong> share </strong>
                    کلیک کنید.
                  </p>
                </div>
                <div className="ios-saffari-share seccond-text">
                  <img src={addIconIOS} />
                  <p>
                    در منوی باز شده، گزینه
                    <strong> Add Home Screen </strong>
                    را کلیک نمایید.
                  </p>
                </div>
                <div className="ios-saffari-share seccond-text">
                  <p className="icon-btn-add btn-add"> Add </p>
                  <p className="btn-add">
                    در نهایت دکمه
                    <strong> Add </strong>
                    را کلیک کنید.
                  </p>
                </div>
              </div>
            )}
            {isChrome && isIOS && (
              <div className="chrome-title-pwa">
                <p>
                  برای عملکرد بهتر لطفا از مرورگر
                  <strong> saffari </strong>
                  استفاده نمایید.
                </p>
              </div>
            )}
            {isChrome && isAndroid && (
              <div className="chrome-title-pwa">
                <p>
                  برای عملکرد بهتر بعد از بستن این پنجره دکمه
                  <strong> Install </strong>
                  را کلیک نمایید.
                </p>
              </div>
            )}
            <Button
              onClick={handleOpen}
              size={"xs"}
              label="متوجه شدم"
              className="btn-pwa"
            />
          </div>
        </Popup>
      )}
    </>
  );
}
