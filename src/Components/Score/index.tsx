import Rating from "@material-ui/lab/Rating";
import { toPersianNumber } from "../hooks/persianHelper";
import "./index.scss";

type ScoreNumberProps = {
  score: number;
  className?: string;
};

export function ScoreNumber({ score, className }: ScoreNumberProps) {
  return (
    <span className={`${className} score-number`}>
      {toPersianNumber(score)}
    </span>
  );
}

type ScoreStarsProps = {
  value: number;
  size?: "small" | "large";
};

export function ScoreStars({ value, size }: ScoreStarsProps) {
  return <Rating value={value / 20} readOnly precision={0.25} size={size} />;
}
