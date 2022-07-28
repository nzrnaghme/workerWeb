import TextFieldm from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

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
  value: string | null | undefined;
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
  styles?: any;
  fullWidth?: boolean;
  shrink?: boolean;
  name?: string;
  field?: any;
  form?: any;
  placeholder?: string;
  dir?: "ltr" | "rtl";
};

function TextField({
  label,
  className,
  onBlur,
  value,
  onTextChange,
  error,
  required,
  multiline,
  rows,
  helperText,
  type,
  disabled,
  fullWidth,
  name,
  field,
  dir = "rtl",
  placeholder,
  shrink,
}: props) {
  const classes = useStyles();

  return (
    <>
      <TextFieldm
        name={name}
        disabled={disabled}
        className={className}
        label={label}
        variant="standard"
        value={value}
        onChange={(e) => {
          if (onTextChange) onTextChange(e.target.value);
        }}
        inputProps={{ dir }}
        InputLabelProps={{
          shrink: shrink,
        }}
        onBlur={onBlur}
        type={type}
        required={required}
        multiline={multiline}
        rows={rows}
        size="small"
        fullWidth={fullWidth}
        error={error}
        {...field}
        placeholder={placeholder}
      />
      <FormHelperText
        className={`${classes.text} ${error ? classes.err : classes.hint}`}
      >
        {error ? helperText : ""}
      </FormHelperText>
    </>
  );
}

export default TextField;
