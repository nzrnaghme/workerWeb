import React from "react";
import Rating from "@material-ui/lab/Rating";

type Props = {
  value: number;
  size?: "small" | "medium" | "large";
  className?: string;
};

function ScoreStars({ className, value, size = "medium" }: Props) {
  return (
    <Rating
      value={value / 20}
      readOnly
      precision={0.25}
      size={size}
      className={className}
    />
  );
}

export default ScoreStars;
