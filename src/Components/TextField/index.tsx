import { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import "./index.scss";

type Props = {
  label: string;
  value: string;
  onTextChange?: (val: string) => void;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  helperText?: string;
  className?: string;
  type?: "text" | "email";
  disabled?: boolean;
  error?: boolean;
  onBlur?: any;
  name?: string;
  field?: any;
  form?: any;
  dir?: "ltr" | "rtl";
  maxLength?: number;
};

function YTextField({
  label,
  className,
  onBlur,
  value,
  onTextChange,
  required,
  multiline,
  rows,
  helperText,
  type,
  disabled,
  name,
  field,
  form,
  dir = "rtl",
  error,
  maxLength,
}: Props) {
  const [hasErr, setHasErr] = useState(false);

  useEffect(() => {
    setHasErr(form?.touched[field?.name] && Boolean(form?.errors[field?.name]));
  }, [form?.touched[field?.name], form?.errors[field?.name]]);

  //Styling Stuff
  useEffect(() => {
    if (!multiline) return;
    const textareas = document.getElementsByTagName("textarea");

    for (let i = 0; i < textareas.length; i++) {
      textareas[i].parentElement!.style.paddingLeft = "10px";
    }
  }, []);

  return (
    <div>
      <TextField
        name={name}
        disabled={disabled}
        className={className}
        label={label}
        variant="standard"
        fullWidth
        value={value}
        onChange={(e) => {
          if (onTextChange) onTextChange(e.target.value);
        }}
        inputProps={{ dir, maxLength }}
        onBlur={onBlur}
        type={type}
        required={required}
        multiline={multiline}
        rows={rows}
        size="small"
        error={hasErr}
        {...field}
      />
      <FormHelperText
        className={hasErr || error ? "helper-err" : "helper-hint"}
      >
        {hasErr ? form?.errors[field?.name] : helperText}
      </FormHelperText>
    </div>
  );
}

export default YTextField;
