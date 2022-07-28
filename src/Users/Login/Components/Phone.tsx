import { useEffect, useState } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Button from "../../../Components/Button";
import PhoneNumField from "../../../Components/PhoneNumField";
import { IPhoneNumberSave, SMSStatus } from "../../../Models/Enums";
import * as service from "../Service";
import { toPersianNumber } from "../../../Components/hooks/persianHelper";
import { toast } from "react-toastify";
import { IResult } from "../../../Services/Entities";
import { trackPromise } from "react-promise-tracker";

type props = {
  click: () => void;
  phoneNumber: string;
  phoneNumberChanged: (e: string) => void;
};

function Phone({ click, phoneNumber, phoneNumberChanged }: props) {
  const matchesSm = useMediaQuery("(max-width:40rem)");
  const [localPhone, setLocalPhone] = useState("");
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (phoneNumber != null && phoneNumber != undefined && phoneNumber != "")
      setLocalPhone(phoneNumber);
  }, [phoneNumber]);

  const phoneClicked = async () => {
    if (localPhone.length !== 9) {
      toast.error(`شماره موبایل باید ${toPersianNumber(11)} رقم باشد`);
    } else {
      const savePhone: IPhoneNumberSave = {
        mobileNo: "09" + phoneNumber.toString(),
      };
      setDisabled(true);
      const res: IResult = await service.insertVerificationCode(savePhone);

      if (res.Error != null) return;
      switch (res.Data) {
        case SMSStatus.SentSms:
          toast.info("پیامک ارسال شده است، لطفا منتظر دریافت آن باشید.");
          click();
          break;
        case SMSStatus.FailedSms:
          toast.error("ارسال پیامک با خطا مواجه شده است");
          setDisabled(false);
          break;
        case SMSStatus.SucceedSms:
          click();
          break;
        case SMSStatus.UsedCode:
          toast.error("کد تایید قبلا استفاده شده است");
          click();
          break;
      }
    }
  };

  return (
    <div className="login-phone">
      <div className="login-phone-wrapper">
        <p className="login-heading">به ای‌رول خوش آمدید.</p>
        <p className="login-hint">
          برای مشاهده سایت لازم است تا ثبت نام نمایید.
        </p>
        <PhoneNumField
          label="شماره همراه"
          // required
          disabled={disabled}
          name="phone number"
          value={localPhone}
          onTextChanged={(e: string) => {
            if (e.length == 9) phoneNumberChanged(e);
            setLocalPhone(e);
          }}
          mask="$$$$$$$$$"
          maskChar="$"
          onKeyDown={(e: any) => {
            if (e.key === "Enter") {
              trackPromise(phoneClicked());
            }
          }}
        />
      </div>
      <div className="single-form-btn-wrapper">
        <Button
          label="ارسال کد تایید"
          size={matchesSm ? "sm" : "lg"}
          onClick={() => {
            trackPromise(phoneClicked());
          }}
          variant="contained"
          disabled={disabled}
          className="login-btn"
        />
      </div>
    </div>
  );
}
export default Phone;
