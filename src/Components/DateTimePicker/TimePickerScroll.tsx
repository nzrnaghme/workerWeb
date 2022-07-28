import { useEffect, useState } from "react";
import MaskedInput from "react-text-mask";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import "./index.scss";
import { toPersianNumber } from "../hooks/persianHelper";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: {
      fontSize: "15px",
    },
    hint: {
      color: "#A0A0A0",
    },
    err: {
      color: "red",
    },
  })
);
interface TextMaskCustomProps {
  //   inputRef: (ref: HTMLInputElement | null) => void;
  label: string;
  duration: string;
  setDuration: (duration: string) => void;
  fullWidth?: boolean;
  field?: any;
  form?: any;
  helperText?: string;
  dir?: "ltr" | "rtl";
}

function TextMaskCustom(props: TextMaskCustomProps) {
  const { ...other } = props;
  return (
    <MaskedInput
      {...other}
      ref={(ref: any) => {
        // inputRef(ref ? ref.inputElement : null);
      }}
      //mask={[/[0-9]/, /[0-9]/, ":", /[0-5]/, /[0-9]/]}
      mask={[
        /^[\u06F0-\u06F90-9]+$/,
        /^[\u06F0-\u06F90-9]+$/,
        ":",
        /^[\u06F0-\u06F90-5]+$/,
        /^[\u06F0-\u06F90-9]+$/,
      ]}
      placeholderChar={"\u2000"}
      showMask
    />
  );
}

function TimePicker({
  label,
  duration,
  setDuration,
  fullWidth,
  field,
  form,
  helperText,
  dir = "ltr",
}: TextMaskCustomProps) {
  const classes = useStyles();
  const [hasErr, setHasErr] = useState(false);

  useEffect(() => {
    setHasErr(form?.touched[field?.name] && Boolean(form?.errors[field?.name]));
  }, [form?.touched[field?.name], form?.errors[field?.name]]);

  return (
    <div>
      <TextField
        variant="outlined"
        label={label}
        value={toPersianNumber(duration)}
        onChange={(e) => {
          setDuration(e.target.value);
        }}
        InputProps={{
          inputComponent: TextMaskCustom as any,
        }}
        InputLabelProps={{ shrink: true, dir }}
        fullWidth
        error={hasErr}
        {...field}
      />
      <FormHelperText
        className={`${classes.text} ${hasErr ? classes.err : classes.hint}`}
      >
        {hasErr ? form?.errors[field?.name] : helperText}
      </FormHelperText>
    </div>
  );
}

export default TimePicker;
