import { useEffect, useState } from "react";
import Button from "../../../../../Components/Button";
import Popup from "../../../../../Components/Popup";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "../../../TimePopup.scss";
import { FormHelperText } from "@material-ui/core";
import { toast } from "react-toastify";
import TimePickerCustome from "../../../../../Components/DateTimePicker/TimePickerPersian";
import moment from "moment";
import DatePickerCustome from "../../../../../Components/DateTimePicker/DatePickerPersian";
import { toEnglishNumber } from "../../../../../Components/hooks/persianHelper";

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
  const [currentTime, setCurrentTime] = useState(moment());

  const msg5 = "زمان انجام کار معتبر نمی باشد.";
  
  useEffect(() => {
    if (open) {
      setCurrentDate(date);
      if (date === undefined && time === undefined) {
        setCurrentDate(null);
        setCurrentTime(null);
      } else if (time) {
        setCurrentTime(
          moment()
            .hour(Number(time.split(":")[0]))
            .minute(Number(time.split(":")[1]))
        );
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
        toast.warning(
          `تاریخ و زمان انجام کار نمی تواند بعد از ${CfgBeginWorkDateDeadline} روز دیگر باشد.`
        );
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
            toast.info(msg5);
            return;
          } else {
            confirm();
            return;
          }
        } else if (timeHour > Number(currentTime.hour())) {
          toast.info(msg5);
          return;
        } else {
          confirm();
          return;
        }
      } else if (
        new Date().toISOString().split("T")[0] >
        currentDate.toISOString().split("T")[0]
      ) {
        toast.info(msg5);
      } else {
        confirm();
      }
    } else {
      confirm();
    }
  };

  const confirm = () => {
    onConfirm({
      date: currentDate!,
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
          className="upsert-dates-back-btn"
          onClick={handleClose}
          size={matchesSm ? "xs" : "sm"}
          variant="outlined"
          color="blue"
        />
      </div>
    </Popup>
  );
};

export default TimeRegisterPopup;
