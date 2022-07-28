//TODO: Repetitive component (is also in W8ing). Refactoring needed.
import useMediaQuery from "@material-ui/core/useMediaQuery";
import TextField from "../../Components/TextField";
import Button from "../../Components/Button";
import Popup from "../../Components/Popup";
import { toPersianNumber } from "../../Components/hooks/persianHelper";

type props = {
  title: string;
  description: string;
  open: boolean;
  onClose: () => void;
};

const WorkingDetailsPopup = ({ title, description, open, onClose }: props) => {
  const matchesSm = useMediaQuery("(max-width:40rem)");
  return (
    <Popup {...{ open, onClose }} className="w8ing-details-popup">
      <div className="w8ing-details-fields-wrapper">
        <TextField
          label="عنوان درخواست"
          value={toPersianNumber(title)}
          disabled
          multiline
        />
        <TextField
          value={description}
          label={description ? "توضیحات" : "توضیحاتی ثبت نشده است..."}
          disabled
          multiline
        />
      </div>
      <div className="w8ing-details-btn-wrapper">
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

export default WorkingDetailsPopup;
