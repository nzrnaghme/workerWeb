import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    hintText: {
      color: "#A0A0A0",
      fontSize: "15px",
    },
  })
);

type Props = {
  name?: string;
  label: string;
  // value: string;
  // onChange: (e: React.ChangeEvent<any>) => void;
  helperText?: string;
  required?: boolean;
  error?: boolean;
  style?: React.CSSProperties;
};

function NumberField(props: Props) {
  const classes = useStyles();

  return (
    <>
      <TextField
        name={props.name}
        label={props.label}
        // value={props.value}
        // onChange={(e: React.ChangeEvent<any>) => {
        //   const numericRegex = /^[0-9\b]+$/;
        //   const { value } = e.target;
        //   if (value === "" || numericRegex.test(value)) {

        //     props.onChange(e);
        //   }
        //   return;
        // }}
        error={props.error}
        required={props.required}
        variant="outlined"
        size="small"
        style={props.style}
        className={classes.root}
        inputProps={{
          inputMode: "tel",
          // dir: "ltr",
        }}
      />
      {!props.error && (
        <FormHelperText {...(!props.error && { className: classes.hintText })}>
          {props.helperText}
        </FormHelperText>
      )}
    </>
  );
}

export default NumberField;
