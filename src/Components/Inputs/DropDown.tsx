import React from "react";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

export interface IdropDownModel {
  id: any;
  name: string;
}

export interface IoptionSort {
  id: any;
  name: string;
  icon?: any;
}

type props = {
  label: string;
  selectedId: any;
  onSelectedChanged: (e: any) => void;
  options: IoptionSort[];
  required?: boolean;
  styles?: object;
  className?: string | undefined;
};

function SelectField({
  className,
  label,
  selectedId,
  onSelectedChanged,
  options,
  required,
  styles,
}: props) {
  return (
    <TextField
      style={styles}
      select
      label={label}
      value={selectedId}
      onChange={(e) => {
        onSelectedChanged(e.target.value);
      }}
      size="small"
      variant="outlined"
      required={required}
      className={className}
      fullWidth
    >
      {options.map((option) => (
        <MenuItem
          value={option.id}
          key={option.name}
          style={{
            display: "flex",
            justifyContent: "right",
            alignItems: "center",
          }}
        >
          <img
            src={option.icon}
            alt=""
            style={{ width: "2rem", marginLeft: "0.5rem" }}
          />
          {option.name}
        </MenuItem>
      ))}
    </TextField>
  );
}

export default SelectField;
