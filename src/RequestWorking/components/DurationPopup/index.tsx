import useMediaQuery from "@material-ui/core/useMediaQuery";
import Button from "../../../Components/Button";
import TextField from "../../../Components/TextField";
import Popup from "../../../Components/Popup";
import "./index.scss";
import { toPersianNumber } from "../../../Components/hooks/persianHelper";

type props = {
  duration: string;
  date: string;
  time: string;
  open: boolean;
  onClose: () => void;
};

const DurationPopup = ({ duration, date, time, open, onClose }: props) => {
  const matchesSm = useMediaQuery("(max-width:40rem)");

  return (
    <Popup className="req-working-duration-popup" {...{ open, onClose }}>
      <div className="r-w-duration-popup-fields-wrapper">
        <TextField
          label="مدت انجام کار"
          value={toPersianNumber(duration ?? "")}
          dir="ltr"
          disabled
        />
        <TextField
          label="تاریخ شروع کار"
          value={toPersianNumber(date ?? "")}
          dir="ltr"
          disabled
        />
        <TextField
          label="زمان شروع کار"
          value={toPersianNumber(time ?? "")}
          dir="ltr"
          disabled
        />
      </div>
      <div className="r-w-duration-popup-btn-wrapper">
        <Button
          onClick={onClose}
          variant="outlined"
          label="بازگشت"
          size={matchesSm ? "xs" : "sm"}
          color="blue"
        />
      </div>
    </Popup>
  );
};
export default DurationPopup;
