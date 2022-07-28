import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    hintText: {
      color: "#A0A0A0",
      fontSize: "15px",
    },
    default: {
      color: "#A0A0A0",
      fontSize: "15px",
    },
  })
);

type props = {
  label?: string;
  time: string;
  onTimeChange: (e: string) => void;
  required?: boolean;
  helperText?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
  fullWidth?: boolean;
};
function TimeField({
  label,
  time,
  onTimeChange,
  error,
  helperText,
  disabled,
  className,
  fullWidth,
}: props) {
  const classes = useStyles();

  return (
    <>
      <TextField
        style={{
          marginTop: "15px",
          direction: "rtl",
        }}
        size="small"
        className={className}
        value={time}
        label={label}
        variant="outlined"
        type="time"
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 min
        }}
        onChange={(e) => {
          onTimeChange(e.target.value);
        }}
        disabled={disabled}
        fullWidth={fullWidth}
      />
      {!error && (
        <FormHelperText
          {...(!error
            ? { className: classes.hintText }
            : { className: classes.default })}
        >
          {helperText}
        </FormHelperText>
      )}
    </>
  );
}
export default TimeField;
