import { MyComments } from "./Entities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toPersianNumber } from "../hooks/persianHelper";
import {
  faThumbsUp,
  faThumbsDown,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { SurveyType } from "../../Models/Enums";

type Props = {
  item: MyComments;
  isClient?: boolean;
};

function RequestPaper({ item, isClient }: Props) {
  const voteIconMaker = (mode: SurveyType | null) => {
    let icon;
    let className: string = "comments-vote-icon";
    switch (mode) {
      case SurveyType.Like:
        icon = faThumbsUp;
        className = className + " blue";
        break;
      case SurveyType.DisLike:
        icon = faThumbsDown;
        className = className + " red";
        break;
      case null:
        icon = faMinus;
        break;
    }

    return <FontAwesomeIcon {...{ icon, className }} />;
  };

  return (
    <div className="comment">
      <div className="comment-date-text">
        <span className="comment-date">{toPersianNumber(item.date ?? "")}</span>
        <p>{item.description}</p>
      </div>
      <div className={`${!isClient && "comments-votes"}`}>
        <div className="comments-vote">
          <span>اخلاق</span>
          {voteIconMaker(item.behavior)}
        </div>
        {!isClient && (
          <>
            <div className="comments-vote">
              <span>کیفیت</span>
              {voteIconMaker(item.quality)}
            </div>
            <div className="comments-vote">
              <span>هزینه</span>
              {voteIconMaker(item.cost)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RequestPaper;
