import { useState } from "react";
import "./index.scss";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Button from "../../../Components/Button";
import Popup from "../../../Components/Popup";
import TimePicker from "../../../Components/DateTimePicker/TimePickerScroll";
import { toast } from "react-toastify";

export interface WorkTimeCallBack {
  duration: string;
}

type props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (time: WorkTimeCallBack) => void;
};

const WorkTimePopup = ({ open, onClose, onConfirm }: props) => {
  const matchesSm = useMediaQuery("(max-width:40rem)");
  const [duration, setDuration] = useState<string>("00:00");

  const onSubmit = () => {
    if (duration === "  :  ") {
      toast.error("مدت انجام کار معتبر نمی باشد.");
    } else if (duration === "00:00") {
      toast.error("لطفا زمان انجام کار را وارد کنید.");
    } else {
      onConfirm({
        duration: duration,
      });
    }
  };

  return (
    <Popup
      {...{ open, onClose }}
      title="زمان حدودی انجام کار"
      className="working-worktime-popup"
    >
      <div className="duration-picker-wrapper">
        <TimePicker
          label="زمان تقریبی"
          duration={duration}
          setDuration={setDuration}
          dir="ltr"
        />
      </div>
      <div className="working-popup-btns-wrapper">
        <Button
          label="تایید"
          onClick={onSubmit}
          size={matchesSm ? "xs" : "sm"}
        />
        <Button
          label="بازگشت"
          variant="outlined"
          color="blue"
          onClick={onClose}
          size={matchesSm ? "xs" : "sm"}
          className="working-popup-back-btn"
        />
      </div>
    </Popup>
  );
};

export default WorkTimePopup;
