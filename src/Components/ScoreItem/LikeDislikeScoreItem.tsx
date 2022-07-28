import "./index.scss";
import blueIcon from "../../Images/blue-icon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { toPersianNumber } from "../hooks/persianHelper";

type Props = {
  title: string;
  like: number;
  dislike: number;
};

function LikeDislikeScoreItem({ title, like, dislike }: Props) {

  return (
    <div className="score-item">
      <div className="score-item-icon">
        <img src={blueIcon} alt="" />
      </div>
      <div className="score-item-data">
        <p>{title}</p>
        <div className="score-item-like-dislike">
          <FontAwesomeIcon icon={faThumbsUp} />
          <p className="score-item-like-num">{toPersianNumber(like)}</p>
          <FontAwesomeIcon icon={faThumbsDown} />
          <p className="score-item-dislike-num">{toPersianNumber(dislike)}</p>
        </div>
      </div>
    </div>
  );
}

export default LikeDislikeScoreItem;
