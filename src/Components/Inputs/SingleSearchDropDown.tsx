import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import { IdropDownModel } from "./DropDown";

type Props = {
  label: string;
  value: IdropDownModel | null | undefined;
  setValue: (item: IdropDownModel | null) => void;
  options: IdropDownModel[];
  required?: boolean;
  helperText?: string;
  className?: any;
  disabled?: boolean;
};

function SingleSearchDropDownY({
  className,
  label,
  value,
  setValue,
  options,
  disabled,
  required,
  helperText,
}: Props) {
  return (
    <>
      <Autocomplete
        id="grouped-demo"
        className={className}
        disablePortal
        noOptionsText="هیچی"
        autoHighlight
        // sx={{ width: 300 }}
        options={options}
        getOptionLabel={(option) => option.name}
        value={value}
        onChange={(s, r) => {
          setValue(r);
        }}
        size="small"
        disabled={disabled}
        fullWidth
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label={label}
            required={required}
          />
        )}
      />
      <FormHelperText className="helper-hint">{helperText}</FormHelperText>
    </>
  );
}

export default SingleSearchDropDownY;
