import "./Param.scss";
import { SurveyType } from "../../Models/Enums";
import ParamIcon from "../../Images/Survey/help.svg";
import Like from "../../Images/Survey/like.svg";
import Dislike from "../../Images/Survey/dislike.svg";

type Props = {
  title: string;
  state: SurveyType | null;
  onLiked: () => void;
  onDisliked: () => void;
};

function Param({ title, state, onLiked, onDisliked }: Props) {
  return (
    <div className="survey-param">
      <div className="survey-param-icon-wrapper">
        <img src={ParamIcon} alt="Parameter" className="survey-param-icon" />
      </div>
      <p className="survey-param-title">{title}</p>
      <div className="survey-param-vote-wrapper">
        <img
          onClick={onLiked}
          src={Like}
          alt="Parameter"
          className={`survey-param-vote ${
            state === SurveyType.Like && "survey-param-like-active"
          }`}
        />
        <img
          onClick={onDisliked}
          src={Dislike}
          alt="Parameter"
          className={`survey-param-vote ${
            state === SurveyType.DisLike && "survey-param-dislike-active"
          }`}
        />
      </div>
    </div>
  );
}

export default Param;
