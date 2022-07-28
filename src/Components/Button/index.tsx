import Button from "@material-ui/core/Button";
import "./index.scss";

type BtnSize = "lg" | "sm" | "xs";

type Props = {
  label: string;
  onClick?: (e?: any) => void;
  variant?: "contained" | "outlined";
  color?: "green" | "blue" | "orange" | "red";
  size?: BtnSize;
  className?: string;
  disabled?: boolean;
  submit?: boolean;
  startIcon?: any;
};

const sizeIdentifier = (size: BtnSize) => {
  switch (size) {
    case "lg":
      return "lg-btn";
    case "sm":
      return "sm-btn";
    default:
      return "xs-btn";
  }
};

const internalClassname = (disabled: boolean, variant: string, color: string) =>
  disabled ? variant + "-" + "disabled" : variant + "-" + color;

function YButton({
  label,
  onClick,
  variant = "contained",
  color = "green",
  size = "xs",
  className,
  disabled = false,
  submit,
  startIcon,
}: Props) {
  return (
    <Button
      {...{ onClick, variant, disabled, startIcon }}
      className={`${internalClassname(
        disabled,
        variant,
        color
      )} ${sizeIdentifier(size)} ${className}`}
      {...(submit && { type: "submit" })}
    >
      {label}
    </Button>
  );
}

export default YButton;
