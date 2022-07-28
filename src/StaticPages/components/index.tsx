import { toPersianNumber } from "../../Components/hooks/persianHelper";
import "./index.scss";

type Props = { children: React.ReactChild; className?: string };

export const Title = ({ children, className }: Props) => {
  return <p className={`statics-title ${className}`}>{children}</p>;
};

export const Paragraph = ({ children, className }: Props) => {
  return <p className={`statics-paragraph ${className}`}>{children}</p>;
};

export const stepsNum = (num: number) => (
  <span className="steps-num">{toPersianNumber("0" + num)}</span>
);
