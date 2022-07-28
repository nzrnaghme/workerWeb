import React, { useState, useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import { toPersianCurrency, toPersianNumber } from "../hooks/persianHelper";

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

type props = {
  label: string;
  value?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  max?: number;
  min?: number;
  dir?: "ltr" | "rtl";
  helperText?: string;
  className?: string;
  field?: any;
  form?: any;
  maxLength?: number;
};

function NumberText({
  className,
  label,
  min,
  max,
  value,
  onChange,
  required,
  // dir = "ltr",
  helperText,
  field,
  form,
  maxLength,
}: props) {
  const classes = useStyles();

  const [hasErr, setHasErr] = useState(false);

  useEffect(() => {
    setHasErr(form?.touched[field?.name] && Boolean(form?.errors[field?.name]));
  }, [form?.touched[field?.name], form?.errors[field?.name]]);

  const persianText = (text: any) => {
    if (text) {
      return toPersianCurrency(toPersianNumber(text));
    }
    return "";
  };

  return (
    <>
      <TextField
        fullWidth
        size="small"
        variant="outlined"
        className={className}
        label={label}
        type="Number"
        inputProps={{ max, min }}
        value={persianText(value)}
        onChange={onChange}
        required={required}
        error={hasErr}
        {...field}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <FormHelperText className={hasErr ? "helper-err" : "helper-hint"}>
        {hasErr ? form?.errors[field?.name] : helperText}
      </FormHelperText>
    </>
  );
}

export default NumberText;
