import "./index.scss";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import TextField from "../../../../Components/TextField";
import Button from "../../../../Components/Button";
import Popup from "../../../../Components/Popup";
import { toPersianNumber } from "../../../../Components/hooks/persianHelper";

type props = {
  title: string;
  content: string;
  open: boolean;
  onClose: () => void;
};

const DetailsRegisterPopup = ({ title, content, open, onClose }: props) => {
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
          label={content ? "توضیحات" : "توضیحاتی ثبت نشده است..."} // Persian text in condition, is displayed in reverse.
          value={content}
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

export default DetailsRegisterPopup;
