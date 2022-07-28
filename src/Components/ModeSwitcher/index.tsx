import Switch from "@material-ui/core/Switch";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import "./index.scss";

const theme = createTheme({
  direction: "ltr",
  // palette: {
  //   primary: { main: "#1c97d7" },
  // },
});

type Props = {
  rightLabel: string;
  leftLabel: string;
  checked: boolean;
  onChecked: (isChecked: boolean) => void;
};

const StyledSwitch = withStyles((theme) => ({
  root: {
    width: "4.7rem",
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    opacity: 1,
    "&$checked": {
      transform: "translateX(3.1rem)",
      color: theme.palette.common.white,
      "& + $track": {
        backgroundColor: "#1c97d7",
        opacity: 1,
        border: "none",
      },
    },
    "&$focusVisible $thumb": {
      color: "#1c97d7",
      // border: "6px solid #fff",
    },
  },
  thumb: {
    width: "1.5rem",
    height: "1.5rem",
  },
  track: {
    borderRadius: "1.6rem",
    // border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: "#1c97d7",
    opacity: 1,
    transition: theme.transitions.create(["background-color"]),
  },
  checked: {},
  focusVisible: {},
}))(Switch);

function ModeSwitcher({ rightLabel, leftLabel, checked, onChecked }: Props) {
  return (
    <ThemeProvider theme={theme}>
      <div dir="ltr" className="switch-wrapper">
        <label className={!checked ? "switch-label-active" : ""}>
          {leftLabel}
        </label>
        <StyledSwitch
          checked={checked}
          onChange={(e) => {
            const isChecked = e.target.checked;
            onChecked(isChecked);
          }}
          color="default"
        />
        <label className={checked ? "switch-label-active" : ""}>
          {rightLabel}
        </label>
      </div>
    </ThemeProvider>
  );
}

export default ModeSwitcher;
