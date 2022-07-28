import { useEffect, useState } from "react";
import Button from "../../../../../Components/Button";
import Popup from "../../../../../Components/Popup";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "../../../TimePopup.scss";
import { FormHelperText } from "@material-ui/core";
import { toast } from "react-toastify";
import moment from "moment";
import jMoment from "moment-jalaali";
import TimePickerCustome from "../../../../../Components/DateTimePicker/TimePickerPersian";
import DatePickerCustome from "../../../../../Components/DateTimePicker/DatePickerPersian";
import DatePicker from "../../../../../Components/DateTimePicker/DatePicker";
import {
  toEnglishNumber,
  toPersianNumber,
} from "../../../../../Components/hooks/persianHelper";
jMoment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });

export const msg7 = (Number: number) =>
  `تاریخ و زمان انجام کار نمی تواند بعد از ${toPersianNumber(
    Number
  )}روز دیگر باشد.`;

export interface timeCallBack {
  date: Date | null | undefined;
  time: string | null;
}

type props = {
  onConfirm: (time: timeCallBack) => void;
  handleClose: () => void;
  time: string | null | undefined;
  date: Date | null | undefined;
  open: boolean;
  onClose: () => void;
  CfgBeginWorkDateDeadline: number;
};

const TimeRegisterPopup = ({
  onConfirm,
  handleClose,
  date,
  time,
  open,
  onClose,
  CfgBeginWorkDateDeadline,
}: props) => {
  const matchesSm = useMediaQuery("(max-width:40rem)");
  const [currentDate, setCurrentDate] = useState<Date | null | undefined>();
  // const [currentDate, setCurrentDate] = useState(moment());
  const [currentTime, setCurrentTime] = useState(moment());

  const msg10 = "زمان انجام کار معتبر نمی باشد.";

  useEffect(() => {
    if (open) {
      if (date === undefined && time === undefined) {
        setCurrentDate(null);
        setCurrentTime(null);
      }
    }
  }, [open]);

  const onSubmit = () => {
    let validDay = moment()
      .add(CfgBeginWorkDateDeadline, "days")
      .format("YYYY-MM-DD");
    if (currentDate) {
      if (
        currentDate.toISOString().split("T")[0] >= toEnglishNumber(validDay)
      ) {
        toast.warning(msg7(CfgBeginWorkDateDeadline));
        return;
      } else if (
        new Date().toISOString().split("T")[0] ===
          currentDate.toISOString().split("T")[0] &&
        currentTime
      ) {
        let timeHour = new Date().getHours();
        let timeMin;
        if (new Date().getMinutes() <= 9) {
          timeMin = "0" + new Date().getMinutes();
        } else {
          timeMin = new Date().getMinutes();
        }
        if (timeHour === Number(currentTime.hour())) {
          if (timeMin > Number(currentTime.minutes())) {
            toast.info(msg10);
            return;
          } else {
            confirm();
            return;
          }
        } else if (timeHour > Number(currentTime.hour())) {
          toast.info(msg10);
          return;
        } else {
          confirm();
          return;
        }
      } else if (
        new Date().toISOString().split("T")[0] >
        currentDate.toISOString().split("T")[0]
      ) {
        toast.info(msg10);
      } else {
        confirm();
      }
    } else if (currentTime) {
      confirm();
    } else {
      confirm();
    }
  };

  const confirm = () => {
    onConfirm({
      date: currentDate ? currentDate : null,
      time: currentTime ? currentTime.format("HH:mm") : null,
    });
  };

  return (
    <Popup className="dates-popup" {...{ open, onClose }}>
      <div className="dates-wrapper">
        <DatePickerCustome
          label="تاریخ انجام درخواست"
          datePicker={currentDate}
          onChangeDate={setCurrentDate}
          remove={() => setCurrentDate(null)}
          removable
          //minDate={new Date()}
        />
        <TimePickerCustome
          label="زمان انجام درخواست"
          timePicker={currentTime}
          onChangetime={setCurrentTime}
          remove={() => setCurrentTime(null)}
          removable
        />
        <FormHelperText style={{ marginTop: "-3%", marginRight: "1%" }}>
          لطفا تاریخ و زمان انجام درخواست را وارد نمایید
        </FormHelperText>
      </div>
      <div className="dates-btns-wrapper">
        <Button
          label="تایید"
          onClick={onSubmit}
          size={matchesSm ? "xs" : "sm"}
        />
        <Button
          label="انصراف"
          onClick={handleClose}
          size={matchesSm ? "xs" : "sm"}
          variant="outlined"
          color="red"
          className="upsert-dates-back-btn"
        />
      </div>
    </Popup>
  );
};

export default TimeRegisterPopup;
