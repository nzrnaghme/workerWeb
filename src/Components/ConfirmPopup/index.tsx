import React from "react";
import { useEffect } from "react";
import Popup from "../Popup";
import Button from "../Button";
import { useGeneralContext } from "../../Providers/GeneralContext";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./index.scss";

export interface IConfirm {
  title?: string;
  msg: string;
  confirmCallback: () => void;
  rejectCallback?: () => void;
}

function Confirm() {
  const matchesSm = useMediaQuery("(max-width:40rem)");
  const {
    confirmMsg,
    confirmTitle,
    confirmCallback,
    rejectCallback,
    confirmPopupOpen,
    setConfirmPopupOpen,
  } = useGeneralContext();

  useEffect(() => {
    window.addEventListener("popstate", (event) => {
      setConfirmPopupOpen(false);
    });
  }, [confirmPopupOpen]);

  const onConfirm = () => {
    confirmCallback();
    setConfirmPopupOpen(false);
  };

  const onReject = () => {
    if (rejectCallback) rejectCallback();
    setConfirmPopupOpen(false);
  };

  return (
    <Popup
      open={confirmPopupOpen}
      onClose={() => {
        setConfirmPopupOpen(false);
      }}
      className="confirm-popup"
    >
      {confirmTitle && <p className="confirm-popup-title">{confirmTitle}</p>}
      <p className="confirm-popup-content">{confirmMsg}</p>
      <div className="confirm-popup-btns-wrapper ">
        <Button
          label="تایید"
          onClick={onConfirm}
          size={matchesSm ? "xs" : "sm"}
        />
        <Button
          label="انصراف"
          onClick={onReject}
          color="red"
          variant="outlined"
          size={matchesSm ? "xs" : "sm"}
          className="confirm-popup-back-btn"
        />
      </div>
    </Popup>
  );
}

export default Confirm;
