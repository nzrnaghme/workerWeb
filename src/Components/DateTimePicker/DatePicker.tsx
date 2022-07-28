import { FunctionComponent, useEffect } from "react";
import ButtonBase from "@material-ui/core/ButtonBase";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/layouts/mobile.css";
import { useField, useFormikContext } from "formik";
import FormHelperText from "@material-ui/core/FormHelperText";
import "./index.scss";
import weekends from "react-multi-date-picker/plugins/highlight_weekends";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

// بهتره که این آرایه خارج از کامپوننت اصلی قرار داده بشه.
const weekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

type props = {
  date: Date | null | undefined;
  onChange: (s: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  nowDay?: number;
  classNameBorder?: string;
  classes?: string;
  label?: string;
  classNameLabel?: string;
  readOnly?: boolean;
  helperText?: string;
  err?: string;
  remove?: () => void;
  removable?: boolean;
};

export default function YDate({
  classNameBorder,
  date,
  onChange,
  minDate,
  nowDay,
  classes,
  label,
  classNameLabel,
  maxDate,
  readOnly,
  helperText,
  err,
  remove,
  removable,
}: props) {
  useEffect(() => {
    if (err === undefined) return;
    const input = document.getElementsByClassName("rmdp-input")[0];
    !!err && input.classList.add("err");
  }, [err]);

  return (
    <div>
      <div className="date-time-picker-container">
        <span className={`date-time-picker-label ${!!err && "err"}`}>
          {label}
        </span>
        <DatePicker
          plugins={[weekends()]}
          readOnly={readOnly}
          className="rmdp-mobile" // To turn mobile mode off.
          maxDate={maxDate}
          weekDays={weekDays}
          calendar={persian}
          locale={persian_fa}
          calendarPosition="bottom-left"
          minDate={minDate}
          value={date}
          onChange={(date: any) => {
            if (date?.isValid) onChange(date.convert().toDate());
          }}
        />
        {removable && (
          <ButtonBase onClick={remove} className="clear-btn">
            <FontAwesomeIcon icon={faTimes} className="clear-btn-icon" />
          </ButtonBase>
        )}
      </div>
      {(helperText || err) && (
        <FormHelperText className={err ? "helper-err" : "helper-hint"}>
          {err ? err : helperText}
        </FormHelperText>
      )}
    </div>
  );
}

type PropsFormik = {
  label?: string;
  name: string;
  helperText?: string;
  minDate?: Date;
  maxDate?: Date;
  classNameLabel?: string;
  classNameBorder?: string;
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
      <YDate
        classNameLabel={props.classNameLabel}
        classNameBorder={props.classNameBorder}
        label={props.label}
        date={field.value}
        onChange={(s: Date) => {
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
