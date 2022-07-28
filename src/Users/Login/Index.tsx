import React, { useState, useEffect, useRef } from "react";
import Paper from "../../Components/Paper";
import CodeOtp from "./Components/CodeOtp";
import Phone from "./Components/Phone";
import * as service from "./Service";
import "./index.scss";
import { addLocalStorage, showLocalStorage } from "../../Routers/localStorage";
import { trackPromise } from "react-promise-tracker";

function User() {
  const storagePhone = showLocalStorage("phoneNumberLogin");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showCode, setShowCode] = useState(false);
  const timerNumberRef = useRef(60);

  useEffect(() => {
    if (phoneNumber != storagePhone) {
      let phoneNumberStorage = "9" + phoneNumber;
      if (phoneNumberStorage !== "9")
        addLocalStorage(phoneNumberStorage, "phoneNumberLogin");
    }
  }, [phoneNumber]);

  const getTimerNumber = async () => {
    const timeOfTimer = await service.getLastSentSms("09" + phoneNumber);
    let x = Math.abs(60 - Number(timeOfTimer.Data));
    if (x > 60) {
      timerNumberRef.current = 60;
      setShowCode(false);
    } else {
      timerNumberRef.current = x;
      setShowCode(true);
    }
    setShowCode(true);
  };

  return (
    <Paper className="login-paper single-form">
      {showCode ? (
        <CodeOtp
          timerNumber={timerNumberRef.current}
          phoneNumber={phoneNumber}
          click={() => setShowCode(false)}
        />
      ) : (
        <Phone
          phoneNumber={phoneNumber}
          phoneNumberChanged={setPhoneNumber}
          click={() => {
            trackPromise(getTimerNumber());
          }}
        />
      )}
    </Paper>
  );
}

export default User;
