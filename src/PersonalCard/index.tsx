import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import "./index.scss";
import { Gender, Disability, OperatorType } from "../Models/Enums";
import { ScoreStars } from "../Components/Score/index";
import { RawAvatar } from "../Components/Avatar";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import * as service from "./Service";
import Popup from "../Components/Modals/Popup";
import { IResult } from "../Services/Entities";
import ShowComments from "../Components/ShowComments";
import { getUserRequestScore } from "../Users/ProfileUser/IService";
import { MyComments } from "../Components/ShowComments/Entities";
import { toast } from "react-toastify";
import { truncateString } from "../Components/hooks/stringHelper";
import { toPersianNumber } from "../Components/hooks/persianHelper";
import SurveyParam from "./components/SurveyParam";
import NumericScoreItem from "../Components/ScoreItem/NumericScoreItem";
import { genderNameMaker } from "../Components/hooks/genderHelper";
import { trackPromise } from "react-promise-tracker";

export const disablityDisplayMaker = (disabilityValuesArr: Disability[]) => {
  const disabilitiesDisplay = disabilityValuesArr.map((i: number) => {
    let disabilitiesArr;
    switch (i) {
      case Disability.MotorDisability:
        disabilitiesArr = "ناتوانی حرکتی";
        break;

      case Disability.DeafnessHearingLoss:
        disabilitiesArr = "ناشنوایی / کم شنوایی";
        break;
    }
    return disabilitiesArr;
  });
  return disabilitiesDisplay.join("، ");
};

export interface IUserInfo {
  bio: string;
  cancellation: number;
  costDislike: number;
  costLike: number;
  delay: number;
  disLike: number;
  disability: Disability[];
  done: number;
  firstName: string;
  gender: Gender;
  lastName: string;
  like: number;
  picture: string;
  qualityDislike: number;
  qualityLike: number;
  score: number;
}

type props = {
  userId: string;
  operatorType: OperatorType;
  open: boolean;
  onClose: () => void;
};

function PersonalCard({ userId, operatorType, open, onClose }: props) {
  const matchesSm = useMediaQuery("(max-width:40rem)");
  const matchesXs = useMediaQuery("(max-width:30rem)");
  const matchesXXs = useMediaQuery("(max-width:25rem)");
  const [showComments, setShowComments] = useState(false);
  const [items, setItems] = useState<MyComments[] | []>([]);
  const [summaryInfo, setSummaryInfo] = useState<IUserInfo>({
    bio: "",
    cancellation: 0,
    costDislike: 0,
    costLike: 0,
    delay: 0,
    disLike: 0,
    disability: [],
    done: 0,
    firstName: "",
    gender: Gender.Female,
    lastName: "",
    like: 0,
    picture: "",
    qualityDislike: 0,
    qualityLike: 0,
    score: 0,
  });
  const [isClient, setIsClient] = useState<boolean | undefined>();

  useEffect(() => {
    if (userId === "" || userId === undefined) return;
    setIsClient(operatorType === OperatorType.Client ? true : false);
    if (operatorType === undefined) return;
    trackPromise(getSummaryUserInfo(userId));
  }, [open]);

  // useEffect(() => {
  //   if (isClient === undefined) return;
  //   trackPromise(getSummaryUserInfo(userId));
  // }, [isClient]);

  const getSummaryUserInfo = async (userId: string) => {
    const info: IResult = await service.getSummaryUserInfo(
      userId,
      operatorType
    );
    if (info.Error != null) return;
    setSummaryInfo(info.Data);
  };

  const showCommandsHandler = async () => {
    const res = await getUserRequestScore(userId);
    let AllCommands = res.Data;
    if (AllCommands.length !== 0) {
      setItems(AllCommands);
      setShowComments(true);
    } else {
      toast.warning("نظری ثبت نشده است.");
    }
  };

  const scoreStars = (
    <div className="p-c-details-score-star">
      <span className="p-c-details-score-num">
        {toPersianNumber(summaryInfo.score)}
      </span>
      <ScoreStars
        value={summaryInfo.score}
        size={matchesSm ? "small" : undefined}
      />
    </div>
  );

  const cmtsDisplayBtn = (
    <div className="comments-display-btn">
      <span className="comments-btn-label">
        {showComments ? (
          <p onClick={() => setShowComments(false)}>عدم نمایش نظرات</p>
        ) : (
          <p
            onClick={() => {
              trackPromise(showCommandsHandler());
            }}
          >
            نمایش نظرات
          </p>
        )}
      </span>
      <FontAwesomeIcon
        icon={!showComments ? faAngleDown : faAngleUp}
        className="comments-label-icon"
        onClick={() => {
          if (showComments) {
            setShowComments(false);
          } else trackPromise(showCommandsHandler());
        }}
      />
    </div>
  );

  return (
    <Popup
      open={open}
      onCloseHandler={() => {
        onClose();
      }}
      className="personal-card-paper"
    >
      <section
        className={`p-c-upper-section ${!matchesSm ? "desktop" : "mobile"}`}
      >
        <div className="p-c-avatar-about">
          <div className="p-c-avatar-name">
            <RawAvatar src={summaryInfo.picture} personalCard />
            <p className="p-c-username">
              {`${summaryInfo.firstName} ${summaryInfo.lastName}`}
            </p>
          </div>
          <div className="p-c-about">
            {matchesSm && scoreStars}
            {summaryInfo.bio && (
              <>
                <label>درباره من:</label>
                <p className="text">
                  {truncateString(
                    summaryInfo!.bio,
                    matchesXXs ? 108 : matchesXs ? 170 : 200
                  )}
                </p>
              </>
            )}
          </div>
          {!matchesSm && cmtsDisplayBtn}
        </div>
        <div className="p-c-details">
          <div className="p-c-details-item1">
            {!matchesSm && scoreStars}
            <div className="p-c-details-sexuality-disability-wrapper">
              <div className="p-c-details-sexuality">
                <label>جنسیت:</label>
                <p className="text">{genderNameMaker(summaryInfo.gender)}</p>
              </div>
              {summaryInfo.disability && summaryInfo.disability.length !== 0 && (
                <div className="p-c-details-disability">
                  <label>وضعیت بدنی:</label>
                  <p className="text">
                    {disablityDisplayMaker(summaryInfo.disability)}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div
            className={
              isClient
                ? "p-c-details-item2-client"
                : "p-c-details-item2-servant"
            }
          >
            <SurveyParam
              title="اخلاق"
              likes={summaryInfo.like}
              dislikes={summaryInfo.disLike}
            />
            {!isClient && (
              <>
                <SurveyParam
                  title="کیفیت"
                  likes={summaryInfo.qualityLike}
                  dislikes={summaryInfo.qualityDislike}
                />
                <SurveyParam
                  title="هزینه"
                  likes={summaryInfo.costLike}
                  dislikes={summaryInfo.costDislike}
                />
              </>
            )}
          </div>
          <div className="p-c-details-item3">
            <div className="numeric-scores-wrapper">
              <NumericScoreItem
                title="انجام شده"
                color="green"
                score={toPersianNumber(summaryInfo.done)}
              />
              <NumericScoreItem
                title="تعداد تاخیر"
                color="orange"
                score={toPersianNumber(summaryInfo.delay)}
              />
              <NumericScoreItem
                title="لغو شده"
                color="red"
                score={toPersianNumber(summaryInfo.cancellation)}
              />
            </div>
            {matchesSm && cmtsDisplayBtn}
          </div>
        </div>
      </section>
      {showComments && (
        <ShowComments
          items={items}
          isClient={operatorType === OperatorType.Client ? true : false}
        />
      )}
    </Popup>
  );
}

export default PersonalCard;
