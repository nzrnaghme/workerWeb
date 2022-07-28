import "./index.scss";
import greenIcon from "../../Images/green-icon.png";
import orangeIcon from "../../Images/orange-icon.png";
import redIcon from "../../Images/red-icon.png";
import { toPersianNumber } from "../hooks/persianHelper";

type Props = {
  color: "green" | "red" | "orange";
  title: string;
  score: string | number;
};

function NumericScoreItem({ title, score, color }: Props) {
  const iconIdentifier = (color: string) => {
    switch (color) {
      case "green":
        return greenIcon;
      case "orange":
        return orangeIcon;
      case "red":
        return redIcon;
    }
  };

  return (
    <div className="score-item">
      <div className="score-item-icon">
        <img src={iconIdentifier(color)} alt="" />
      </div>
      <div className="score-item-data">
        <p>{title}</p>
        <p className={`numeric-score-item-data-num-${color}`}>{score}</p>
      </div>
    </div>
  );
}

export default NumericScoreItem;
