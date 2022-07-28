import "./index.scss";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { FunctionComponent } from "react";
import { useField, useFormikContext } from "formik";
import FormHelperText from "@material-ui/core/FormHelperText";
import "react-multi-date-picker/styles/layouts/mobile.css";

type props = {
  time: Date;
  onChange: (time: Date) => void;
  minTime?: Date;
  nowDay?: number;
  classNameBorder?: string;
  helperText?: string;
  label?: string;
  className?: string;
  classNameLabel?: string;
  readOnly?: boolean;
  err?: boolean;
};

export default function FaTimePicker({
  classNameBorder,
  time,
  onChange,
  minTime,
  nowDay,
  label,
  classNameLabel,
  readOnly,
  helperText,
  err,
}: props) {
  return (
    <div>
      <div className="date-time-picker-container">
        <span className="date-time-picker-label">{label}</span>
        <DatePicker
          readOnly={readOnly}
          className="rmdp-mobile"
          minDate={minTime}
          format="HH:mm"
          disableDayPicker
          calendar={persian}
          locale={persian_fa}
          calendarPosition="bottom"
          value={time}
          plugins={[<TimePicker hideSeconds />]}
          onChange={(time: any) => {
            if (time?.isValid) onChange(time.convert().toDate());
          }}
        />
      </div>
      {(helperText || err) && (
        <FormHelperText className={err ? "helper-err" : "helper-hint"}>
          {/* {err ? err : helperText} */}
          {helperText}
        </FormHelperText>
      )}
    </div>
  );
}

type PropsFormik = {
  label?: string;
  name: string;
  helperText?: string;
  minTime?: Date;
  className?: any;
  validateTime?: any;
  err?: boolean;
};

export const TimeFormik: FunctionComponent<PropsFormik> = ({
  helperText,
  err,
  ...props
}) => {
  const [field, { error, touched }] = useField({
    name: props.name,
  });
  const { setFieldValue } = useFormikContext();

  return (
    <FaTimePicker
      label={props.label}
      time={field.value}
      onChange={(s: Date) => {
        setFieldValue(field.name, s);
      }}
      minTime={props.minTime}
      helperText={helperText}
      err={touched && err ? err : undefined} //TODO: Validation has issues.
    />
  );
};
