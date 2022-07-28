import { useEffect } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Button from "../../../Components/Button";
import TextField from "../../../Components/TextField";
import { toPersianNumber } from "../../../Components/hooks/persianHelper";

type props = {
  handleClose: () => void;
  currentPersianDate: string;
  currentTime: string;
};

const TimeWaitingPopup = ({
  handleClose,
  currentPersianDate,
  currentTime,
}: props) => {
  const matchesSm = useMediaQuery("(max-width:40rem)");
  useEffect(() => {}, [currentTime]);

  return (
    <>
      <div className="dates-wrapper">
        <TextField
          label="تاریخ مراجعه"
          value={toPersianNumber(currentPersianDate)}
          disabled
          dir="ltr"
        />
        <TextField
          label="زمان مراجعه"
          value={toPersianNumber(currentTime)}
          disabled
          dir="ltr"
        />
      </div>
      <div className="dates-btns-wrapper dates-single-btn-wrapper">
        <Button
          onClick={handleClose}
          variant="outlined"
          label="بازگشت"
          size={matchesSm ? "xs" : "sm"}
          color="blue"
        />
      </div>
    </>
  );
};
export default TimeWaitingPopup;
