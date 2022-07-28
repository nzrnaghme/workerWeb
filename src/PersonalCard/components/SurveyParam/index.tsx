import "./index.scss";
import ParamIcon from "../../../Images/Survey/help.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { toPersianNumber } from "../../../Components/hooks/persianHelper";

type Props = {
  title: string;
  likes: number;
  dislikes: number;
};

function Param({ title, likes, dislikes }: Props) {
  return (
    <div className="survey-param">
      <div className="survey-param-icon-wrapper">
        <img src={ParamIcon} alt="Parameter" className="survey-param-icon" />
      </div>
      <p className="survey-param-title">{title}</p>
      <div className="p-c-survey-param-vote-wrapper">
        <div className="survey-param-vote-item">
          <FontAwesomeIcon icon={faThumbsUp} />
          <span>{toPersianNumber(likes)}</span>
        </div>
        <div className="survey-param-vote-item">
          <FontAwesomeIcon icon={faThumbsDown} />
          <span>{toPersianNumber(dislikes)}</span>
        </div>
      </div>
    </div>
  );
}

export default Param;
