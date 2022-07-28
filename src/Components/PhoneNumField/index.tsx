import TextField from "@material-ui/core/TextField";
import { maskValue, unmaskValue } from "../Inputs/Mask";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { toPersianNumber } from "../hooks/persianHelper";
import "./index.scss";

type props = {
  label: string;
  name: string;
  value?: string;
  defaultValue?: string;
  onValidChanged?: any;
  onTextChanged?: any;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  mask?: string;
  maskChar?: string;
  disabled?: boolean;
  ref?: any;
  placeholder?: string;
  onKeyDown?: (e: any) => void;
};

function PhoneNumField({
  label,
  placeholder,
  value,
  mask,
  maskChar,
  onTextChanged,
  disabled,
  required,
  minLength,
  maxLength,
  ref,
  onKeyDown,
}: props) {
  return (
    <div className="phone-num-field-wrapper">
      <TextField
        className="phone-num-field"
        fullWidth
        variant="standard"
        label={label}
        size="small"
        placeholder={placeholder}
        value={maskValue(value, mask, maskChar)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        required={required}
        inputProps={{
          dir: "ltr",
          inputMode: "tel",
          minLength: minLength,
          maxLength: maxLength,
        }}
        inputRef={ref}
        onChange={(e) => {
          const val = e.target.value;
          onTextChanged(unmaskValue(val, mask));
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment
              position="start"
              style={{ fontSize: "20px", color: "#7E7E7E" }}
            >
              <FontAwesomeIcon icon={faPhone} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {toPersianNumber("09")}
            </InputAdornment>
          ),
        }}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <FormHelperText className="help-text">
        مثال: {toPersianNumber("09123456789")}
      </FormHelperText>
    </div>
  );
}

export default PhoneNumField;
