import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { maskValue, unmaskValue } from "./Mask";
import FormControl from "@material-ui/core/FormControl";
import "./NationalCode.css";
import { toEnglishNumber } from "../hooks/persianHelper";

const useStyles = makeStyles((theme) => ({
  root: {
    // '& label.Mui-focused': {
    //     color: '#1976d2',
    //     fontSize: '16px',
    //     fontWeight: 'bold'
    // },
    // '& .MuiOutlinedInput-root': {
    //     '& fieldset': {
    //         borderColor: 'gray',
    //     },
    //     '&:hover fieldset': {
    //         border: '1px solid gray',
    //     },
    //     '&.Mui-focused fieldset': {
    //         border: '1px solid #1976d2',
    //     },
    // }
  },
}));

type props = {
  label?: string;
  value?: string;
  onTextChanged?: any;
  required?: boolean;
  mask?: string;
  maskChar?: string;
  disabled?: boolean;
  minLength?: number;
  maxLength?: number;
  styles?: {};
  className?: string;
};

function NationalCode(props: props) {
  const classes = useStyles();

  return (
    <TextField
      style={props.styles}
      // disabled={props.disabled}
      variant="standard"
      label={props.label}
      className={props.className}
      size="small"
      value={maskValue(props.value, props.mask, props.maskChar)}
      onChange={(e) => {
        const val = toEnglishNumber(e.target.value);
        if (val === "") {
          props.onTextChanged(unmaskValue(val, props.mask));
        } else if (!/^[0-9]+$/i.test(val))
          props.onTextChanged(unmaskValue("", props.mask));
        else props.onTextChanged(unmaskValue(val, props.mask));
      }}
      inputProps={{
        inputMode: "tel",
        dir: "ltr",
        minLength: props.minLength,
        maxLength: props.maxLength,
      }}
      required={props.required}
    />
  );
}

export default NationalCode;
