import "./index.scss";
import Divider from "@material-ui/core/Divider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMale,
  faFemale,
  faClock,
  faComments,
  faHandshake,
  faTransgender,
  faTransgenderAlt,
  faMarsStroke,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import Paper from "../Paper";
import { ScoreStars } from "../Score";
import Button from "../Button";
import { IPresentableRequest } from "../../Registers/DailyRequestContainList/Entities";
import { Gender } from "../../Models/Enums";
import { toPersianNumber } from "../hooks/persianHelper";
import HeaderItem from "../../Components/ReqPaperHeaderItem";
import { genderNameMaker } from "../hooks/genderHelper";
import { truncateString } from "../hooks/stringHelper";

type Props = {
  item: IPresentableRequest;
  callBackAddRequest: (id: string, userId: string) => void;
};

function RequestPaper({ item, callBackAddRequest }: Props) {
  const ShowDateTime = () => {
    if (item.beginDate !== null && item.beginTime !== null) {
      return (
        <>
          <span>{toPersianNumber(item.beginTime)}</span>
          <span className="datetime-dash-seperator">-</span>
          <span>{toPersianNumber(item.beginDate)}</span>
        </>
      );
    } else if (item.beginDate !== null) {
      return <span>{toPersianNumber(item.beginDate)}</span>;
    } else if (item.beginTime !== null) {
      return <span>{toPersianNumber(item.beginTime)}</span>;
    }
  };

  const persianText = (text: any) => {
    if (text) {
      return toPersianNumber(text);
    }
    return "";
  };

  const RegionFiled = () => {
    if (item.region != null) {
      return item.region[0];
    }
    return "ایران";
  };

  const genderIconIdentifier = (gender: Gender | undefined) => {
    switch (gender) {
      case Gender.Male:
        return faMale;
      case Gender.Female:
        return faFemale;
      case Gender.Transgender:
        return faTransgender;
      case Gender.Transwoman:
        return faTransgenderAlt;
      case Gender.Transman:
        return faMarsStroke;
    }
  };

  return (
    <Paper className="request-paper">
      <header className="req-paper-header">
        <div className="score-container">
          <div className="stars-num-wrapper">
            <ScoreStars value={item.clientScore} size="small" />
            <span className="r-p-user-score-num">
              {toPersianNumber(item.clientScore)}
            </span>
          </div>
          <HeaderItem icon={genderIconIdentifier(item.gender)}>
            {genderNameMaker(item.gender)}
          </HeaderItem>
        </div>
        <div className="req-header-items-wrapper">
          <HeaderItem icon={item.presenceType ? faComments : faHandshake}>
            {item.presenceType === 0 ? "حضوری" : "غیرحضوری"}
          </HeaderItem>
          <HeaderItem icon={faClock}>
            <div className="req-paper-date-time">{ShowDateTime()}</div>
          </HeaderItem>
        </div>
      </header>
      <Divider className="req-paper-main-divider" />
      <main className="req-paper-main">
        <p className="req-paper-title">{toPersianNumber(item.title)}</p>
        {/* <p className="req-paper-description">
          {truncateString(persianText(item.content), 40)}
        </p> */}
        <footer className="req-paper-footer-wrapper">
          <span className="req-paper-location-wrapper">
            <FontAwesomeIcon id="location-icon" icon={faMapMarkerAlt} />
            <p className="req-paper-location">{RegionFiled()}</p>
          </span>
          <Button
            label="جزییات"
            onClick={() => {
              callBackAddRequest(item.id, item.userId);
            }}
          />
        </footer>
      </main>
    </Paper>
  );
}

export default RequestPaper;
