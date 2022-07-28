import moment from "moment";
import jMoment from "moment-jalaali";
import JalaliUtils from "@date-io/jalaali";
import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import ButtonBase from "@material-ui/core/ButtonBase";
jMoment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });

type Props = {
  label: string;
  timePicker: moment.Moment;
  onChangetime: (s: moment.Moment) => void;
  remove?: () => void;
  removable?: boolean;
};

function TimePickerCustome({
  label,
  timePicker,
  onChangetime,
  remove,
  removable,
}: Props) {
  return (
    <MuiPickersUtilsProvider utils={JalaliUtils} locale="fa">
      <TimePicker
        label={label}
        fullWidth
        okLabel="تأیید"
        cancelLabel="لغو"
        labelFunc={(date) => (date ? date.format("HH:mm") : "")}
        value={timePicker}
        ampm={false}
        onChange={(s) => {
          if (s != null) {
            onChangetime(s);
          }
        }}
      />
      {removable && (
        <ButtonBase onClick={remove} className="clear-btn">
          <FontAwesomeIcon icon={faTimes} className="clear-btn-icon" />
        </ButtonBase>
      )}
    </MuiPickersUtilsProvider>
  );
}
export default TimePickerCustome;
