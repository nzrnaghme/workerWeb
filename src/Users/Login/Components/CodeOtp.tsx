import { useEffect, useState } from "react";
import {
  toEnglishNumber,
  toPersianNumber,
} from "../../../Components/hooks/persianHelper";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { ILoginSave, LoginResult } from "../../../Models/Enums";
import * as service from "../Service";
import { useHistory } from "react-router-dom";
import OTPInput from "../../../Components/Inputs/OTPInput";
import { IUserLogin } from "../../../Providers/Entities";
import { toast } from "react-toastify";
import { IResult } from "../../../Services/Entities";
import { addLocalStorage } from "../../../Routers/localStorage";
import { trackPromise } from "react-promise-tracker";

type CounterChildrenProps = {
  remainingTime: number;
  color: string;
};

type props = {
  phoneNumber: string;
  timerNumber: any;
  click: () => void;
};
function CodeOtp({ click, phoneNumber, timerNumber }: props) {
  const history = useHistory();
  const [timerFinished, setTimerFinished] = useState(false);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    setPhone(phoneNumber);
  }, [phoneNumber]);

  const userInfo = async (token: any) => {
    let setToken = {
      Id: "",
      MobileNo: "09" + phone,
      FirstName: "",
      LastName: "",
      userName: "",
      Gender: "",
      CardNumber1: "",
      CardNumber2: "",
      LastLogin: "",
      RefreshToken: token.refreshToken,
      AccessToken: token.accessToken,
    };
    addLocalStorage(JSON.stringify(setToken), "user");
    const data: IResult = await service.getUserInfo("09" + phone);

    let newUserLogin: IUserLogin = {
      Id: data.Data.id,
      MobileNo: "09" + phone,
      FirstName: data.Data.firstName,
      LastName: data.Data.lastName,
      userName: "",
      Gender: data.Data.gender,
      CardNumber1: data.Data.cardNumber1,
      CardNumber2: data.Data.cardNumber2,
      LastLogin: data.Data.lastLogin,
      RefreshToken: token.refreshToken,
      AccessToken: token.accessToken,
    };
    addLocalStorage(JSON.stringify(newUserLogin), "user");
    window.location.reload();
  };

  useEffect(() => {
    if (timerFinished) click();
  }, [timerFinished]);

  const codeClicked = async (number: string) => {
    if (number.length !== 5) return;
    const saveOTP: ILoginSave = {
      mobileNo: "09" + phone.toString(),
      code: Number(toEnglishNumber(number)),
    };
    const res: IResult = await service.login(saveOTP);
    if (res.Error != null) return;
    switch (res.Data.userResponse) {
      case LoginResult.WrongCode:
        toast.error("???? ?????????? ???????? ?????? ???????? ?????? ????????");
        break;
      // old user
      case LoginResult.VerifiedLogin:
        userInfo(res.Data.token);
        break;
      // new user
      case LoginResult.NewUser:
        let newUserLogin: IUserLogin = {
          Id: "",
          MobileNo: "09" + phone,
          FirstName: "",
          LastName: "",
          userName: "",
          Gender: "",
          CardNumber1: "",
          CardNumber2: "",
          LastLogin: "",
          AccessToken: "",
          RefreshToken: "",
        };
        addLocalStorage(JSON.stringify(newUserLogin), "user");
        history.push("/RegisterUser");
        break;
      case LoginResult.BlockedUser:
        toast.error(
          "???????? ???????????? ?????? ?????????? ???? ???????? ???????? ???? ???????????????? ???????? ????????????"
        );
        break;
      case LoginResult.UsedCode:
        toast.error("???? ?????????? ???????? ?????????????? ?????? ??????");
        break;
    }
  };

  return (
    <>
      <p className="login-heading" id="phone-number">
        {toPersianNumber("09" + phoneNumber)}
      </p>
      <p className="login-otp-hint">
        ???? ?????? ???????? ?????????? ?????? ???? ?????????? ?? ???????? ???? ???????? ????????????.
      </p>
      <OTPInput
        className="login-otp-inputs-wrapper"
        autoFocus
        isNumberInput
        length={5}
        inputStyle={{
          color: "#00707e",
          outline: "white !important",
          margin: "4px",
          border: "2px solid #00707e",
          borderTop: "none",
          borderRight: "none",
          borderLeft: "none",
          borderRadius: "0px",
          width: "2.5rem",
          textAlign: "center",
          fontSize: "20px",
        }}
        onChangeOTP={(c) => {
          trackPromise(codeClicked(c));
        }}
        codeClicked={(s) => {
          trackPromise(codeClicked(s));
        }}
      />
      <CountdownCircleTimer
        isPlaying
        duration={60}
        initialRemainingTime={timerNumber}
        colors={["#00707e", "#F7B801", "#F7B801", "#A30000"]}
        colorsTime={[60, 35, 15, 0]}
        size={130}
        strokeWidth={6}
        onComplete={(totalElapsedTime: number) => {
          setTimerFinished(true);
        }}
      >
        {({ remainingTime, color }: CounterChildrenProps) => (
          <p className="login-countdown-circle-num" style={{ color }}>
            {toPersianNumber(remainingTime)}
          </p>
        )}
      </CountdownCircleTimer>
    </>
  );
}
export default CodeOtp;
