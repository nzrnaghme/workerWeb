import React from "react";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

interface ISelectItem {
  id: any;
  name: string;
}

type props = {
  label: string;
  value: any;
  onSelectChanged: (selected: any) => void;
  options: ISelectItem[];
  required?: boolean;
  styles?: object;
  className?: string;
};

function SelectField(props: props) {
  return (
    <TextField
      fullWidth
      select
      className={props.className}
      label={props.label}
      value={props.value}
      onChange={(e) => {
        props.onSelectChanged(e.target.value);
      }}
      variant="standard"
      required={props.required}
      size="small"
    >
      {props.options.map((option) => (
        <MenuItem value={option.id} key={option.id}>
          {option.name}
        </MenuItem>
      ))}
    </TextField>
  );
}

export default SelectField;
