import { FunctionComponent, useEffect, useState } from "react";
import moment from "moment";
import jMoment from "moment-jalaali";
import JalaliUtils from "@date-io/jalaali";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import ButtonBase from "@material-ui/core/ButtonBase";
import FormHelperText from "@material-ui/core/FormHelperText";
import { useField, useFormikContext } from "formik";
jMoment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });

type Props = {
  label: string;
  datePicker: Date | null | undefined;
  onChangeDate: (s: Date) => void;
  remove?: () => void;
  removable?: boolean;
  err?: string;
  helperText?: string;
  minDate?: Date;
  maxDate?: Date;
};

function DatePickerCustome({
  label,
  datePicker,
  onChangeDate,
  remove,
  removable,
  helperText,
  err,
  minDate,
  maxDate,
}: Props) {
  useEffect(() => {
    if (!datePicker) {
      setCurrentDate(null);
    } else setCurrentDate(moment(datePicker));
  }, []);

  const [currentDate, setCurrentDate] = useState(moment());

  const Removable = () => {
    setCurrentDate(null);
    remove();
  };

  return (
    <MuiPickersUtilsProvider utils={JalaliUtils} locale="fa">
      <div className="date-picker">
        <DatePicker
          label={label}
          showTodayButton
          orientation="portrait"
          allowKeyboardControl={true}
          todayLabel="امروز"
          okLabel="تأیید"
          cancelLabel="لغو"
          clearLabel="پاک کردن"
          format="jYYYY/jMM/jDD"
          emptyLabel=""
          labelFunc={(date) => (date ? date.format("jYYYY/jMM/jDD") : "")}
          value={currentDate}
          onChange={(s) => {
            if (s != null) {
              setCurrentDate(s);
              onChangeDate(new Date(s));
            }
          }}
          minDate={minDate}
          maxDate={maxDate}
          style={{ width: "100%" }}
        />
        {removable && (
          <ButtonBase onClick={Removable} className="clear-btn-Date-Picker">
            <FontAwesomeIcon icon={faTimes} className="clear-btn-icon" />
          </ButtonBase>
        )}
      </div>
      {(helperText || err) && (
        <FormHelperText className={err ? "helper-err" : "helper-hint"}>
          {err ? err : helperText}
        </FormHelperText>
      )}
    </MuiPickersUtilsProvider>
  );
}
export default DatePickerCustome;

type PropsFormik = {
  label: string;
  name: string;
  helperText?: string;
  minDate?: Date;
  maxDate?: Date;
};

export const DateFormik: FunctionComponent<PropsFormik> = ({
  helperText,
  ...props
}) => {
  const [field, { error, touched }] = useField({
    name: props.name,
  });
  const { setFieldValue } = useFormikContext();

  return (
    <>
      <DatePickerCustome
        label={props.label}
        datePicker={field.value}
        onChangeDate={(s: Date) => {
          setFieldValue(field.name, s);
        }}
        minDate={props.minDate}
        maxDate={props.maxDate}
        helperText={helperText}
        err={touched && error ? error : undefined}
      />
    </>
  );
};
