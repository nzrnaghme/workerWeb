import { useEffect, useState } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./index.scss";
import Paper from "../../../../Components/Paper";
import NumericScoreItem from "../../../../Components/ScoreItem/NumericScoreItem";
import LikeDislikeScoreItem from "../../../../Components/ScoreItem/LikeDislikeScoreItem";
import ScoreStars from "../../../../Components/Score/ScorStars";
import { ClientScore, IUserInfo, ServantScore } from "../../Entities";
import { EditableAvatar } from "../../../../Components/Avatar";
import { toPersianNumber } from "../../../../Components/hooks/persianHelper";

import * as service from "../../../ProfileUser/IService";
import { toast } from "react-toastify";
import { MyComments } from "../../../../Components/ShowComments/Entities";
import { showLocalStorage } from "../../../../Routers/localStorage";
import CommentsPopup from "./components/CommentsPopup";
import { trackPromise } from "react-promise-tracker";

type Props = {
  clientScores: ClientScore | undefined;
  servantScores: ServantScore | undefined;
  img: string | null;
  upsertImgRef: any;
  onUploadingImg: any;
  onUpsertImgClicked: any;
  OpenRemoveImg: any;
  personalData: IUserInfo | undefined;
  verifiedPictureUser: boolean;
  rejectedPicture: boolean;
};

interface AvatarProps {
  img: string | null;
  upsertImgRef: any;
  onUploadingImg: any;
  onUpsertImgClicked: any;
  OpenRemoveImg: any;
  personalData: IUserInfo | undefined;
  verifiedPictureUser: boolean;
  rejectedPicture: boolean;
}

const Avatar = ({
  img,
  onUploadingImg,
  upsertImgRef,
  onUpsertImgClicked,
  OpenRemoveImg,
  personalData,
  verifiedPictureUser,
  rejectedPicture,
}: AvatarProps) => (
  <div className="user-scores-editable-avatar-wrapper">
    <EditableAvatar
      rejectedPicture={rejectedPicture}
      verifiedPictureUser={verifiedPictureUser}
      src={img}
      onUploadingImg={onUploadingImg}
      onUpsertClicked={onUpsertImgClicked}
      upsertRef={upsertImgRef}
      onDeleteClicked={OpenRemoveImg}
      className="user-scores-editable-avatar"
    />
    <p className="user-scores-user-name">{`${personalData?.firstName} ${personalData?.lastName}`}</p>
  </div>
);

function ScoreUser({
  clientScores,
  servantScores,
  img,
  onUploadingImg,
  upsertImgRef,
  onUpsertImgClicked,
  OpenRemoveImg,
  personalData,
  verifiedPictureUser,
  rejectedPicture,
}: Props) {
  const matchesSm = useMediaQuery("(max-width:40rem)");
  const [showComments, setShowComments] = useState(false);
  const [average, setAvareage] = useState<number>(0);
  const storageUser = showLocalStorage("user");
  const [items, setItems] = useState<MyComments[] | []>([]);

  useEffect(() => {
    if (clientScores != null && servantScores != null) {
      let totalClient = clientScoresAverage(clientScores);
      let totalServant = servantScoreAverage(servantScores);
      if (totalClient === 0) {
        setAvareage(totalServant);
      } else if (totalServant === 0) {
        setAvareage(totalClient);
      } else {
        let avrageAll = (totalClient + totalServant) / 2;
        setAvareage(avrageAll);
      }
    }
  }, [clientScores, servantScores]);

  const clientScoresAverage = (clientScores: ClientScore) => {
    let total = clientScores.score;
    if (total === undefined) {
      return 0;
    }
    return total;
  };

  const servantScoreAverage = (servantScores: ServantScore) => {
    let total = servantScores.score;
    if (total === undefined) {
      return 0;
    }
    return total;
  };
  const showCommentsHandler = async () => {
    const res = await service.getUserRequestScore(storageUser.Id);
    const allComments = res.Data;

    if (allComments.length !== 0) {
      setItems(allComments);
      setShowComments(true);
    } else {
      toast.warning("نظری ثبت نشده است.");
    }
  };

  return (
    <Paper className="profile-paper">
      <div className="user-scores">
        <div className="user-scores-data">
          <div className="user-scores-star-score-wrapper">
            <ScoreStars
              value={average}
              size={!matchesSm ? "large" : "medium"}
            />
            <p>{toPersianNumber(average)}</p>
          </div>
          {matchesSm && (
            <Avatar
              {...{
                rejectedPicture,
                img,
                onUploadingImg,
                upsertImgRef,
                onUpsertImgClicked,
                OpenRemoveImg,
                personalData,
                verifiedPictureUser,
              }}
            />
          )}
          <p className="user-scores-heading">جزییات درخواستهای ثبت شده</p>
          <div className="user-scores-items-wrapper">
            <div className="grouped-score-items-wrapper">
              <NumericScoreItem
                color="green"
                title="انجام شده"
                score={toPersianNumber(clientScores?.doneCount ?? 0)}
              />
              <NumericScoreItem
                color="orange"
                title="تعداد تاخیر"
                score={toPersianNumber(clientScores?.delayCount ?? 0)}
              />
              <NumericScoreItem
                color="red"
                title="لغو شده"
                score={toPersianNumber(clientScores?.cancellationCount ?? 0)}
              />
            </div>
            <div className="grouped-score-items-wrapper">
              <LikeDislikeScoreItem
                title="اخلاق"
                like={clientScores?.behaviorLikeCount ?? 0}
                dislike={clientScores?.behaviorDislikeCount ?? 0}
              />
            </div>
          </div>
          <p className="user-scores-heading">جزییات کارهای انجام شده</p>
          <div className="user-scores-items-wrapper">
            <div className="grouped-score-items-wrapper">
              <NumericScoreItem
                color="green"
                title="انجام شده"
                score={toPersianNumber(servantScores?.doneCount ?? 0)}
              />
              <NumericScoreItem
                color="orange"
                title="تعداد تاخیر"
                score={toPersianNumber(servantScores?.delayCount ?? 0)}
              />
              <NumericScoreItem
                color="red"
                title="لغو شده"
                score={toPersianNumber(servantScores?.cancellationCount ?? 0)}
              />
            </div>
            <div className="grouped-score-items-wrapper">
              <LikeDislikeScoreItem
                title="اخلاق"
                like={servantScores?.behaviorLikeCount ?? 0}
                dislike={servantScores?.behaviorDislikeCount ?? 0}
              />
              <LikeDislikeScoreItem
                title="کیفیت"
                like={servantScores?.qualityLikeCount ?? 0}
                dislike={servantScores?.qualityDislikeCount ?? 0}
              />
              <LikeDislikeScoreItem
                title="هزینه"
                like={servantScores?.costLikeCount ?? 0}
                dislike={servantScores?.costDislikeCount ?? 0}
              />
            </div>
          </div>
          <CommentsPopup
            open={showComments}
            onClose={() => setShowComments(false)}
            items={items}
          />
          <p className="user-scores-comments" onClick={()=>{
            trackPromise(showCommentsHandler());
          }}>
            نمایش نظرات
          </p>
        </div>
        {!matchesSm && (
          <Avatar
            {...{
              rejectedPicture,
              verifiedPictureUser,
              img,
              onUploadingImg,
              upsertImgRef,
              onUpsertImgClicked,
              OpenRemoveImg,
              personalData,
            }}
          />
        )}
      </div>
    </Paper>
  );
}

export default ScoreUser;
