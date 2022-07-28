import React, { useEffect } from "react";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import "../Registers/Requests/AddRequest/index.css";
import { alpha, styled } from "@mui/material/styles";
import { green } from "@mui/material/colors";

type props = {
  onConfirm: (which: boolean) => void;
  select1: string;
  select2: string;
  select1Style: object;
  select2Style: object;
  defaulteCheck: boolean;
};

const GreenSwitch = styled(Switch)(({ theme }) => ({
  width: 75,
  height: 42,
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: green[800],
    "&:hover": {
      backgroundColor: alpha(green[900], theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: green[800],
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 30,
    height: 30,
    margin: "-5px 2px 0px 16px",
  },
  "& .MuiSwitch-switchBase": { color: green[800], margin: "2px 2px 0px -13px" },
}));

const RadioButton = ({
  onConfirm,
  select1,
  select2,
  select1Style,
  select2Style,
  defaulteCheck,
}: props) => {
  const [checked, setChecked] = React.useState(true);

  useEffect(() => {
    setChecked(defaulteCheck);
  }, [defaulteCheck]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    onConfirm(event.target.checked);
  };

  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography style={select1Style}>{select1}</Typography>
        <GreenSwitch
          checked={checked}
          onChange={handleChange}
          inputProps={{ "aria-label": "controlled" }}
          size="medium"
        />
        <Typography style={select2Style}>{select2}</Typography>
      </Stack>
    </>
  );
};
export default RadioButton;
