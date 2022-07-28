import { useState } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Button from "../../../Components/Button";
import FaTimePicker from "../../../Components/DateTimePicker/FaTimePicker";

export interface extendCallBack {
  time: Date;
}

type props = {
  onConfirm: (time: extendCallBack) => void;
  handleClose: () => void;
};
const Extend = ({ onConfirm, handleClose }: props) => {
  const matchesSm = useMediaQuery("(max-width:40rem)");
  const [time, setTime] = useState<Date>(new Date("October 13, 2014 00:30:00"));

  const onSubmit = () => {
    onConfirm({
      time: time,
    });
  };

  return (
    <>
      <div className="w8ing-extend-time-field">
        <FaTimePicker label="زمان تمدید" time={time} onChange={setTime} />
      </div>
      <div className="w8ing-extend-btns-wrapper">
        <Button
          onClick={onSubmit}
          label="تایید"
          size={matchesSm ? "xs" : "sm"}
        />
        <Button
          onClick={handleClose}
          label="بازگشت"
          variant="outlined"
          size={matchesSm ? "xs" : "sm"}
          color="blue"
          className="w8ing-extend-back-btn"
        />
      </div>
    </>
  );
};
export default Extend;
