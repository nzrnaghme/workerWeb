import { useState, useEffect } from "react";
import RequestStatus from "../../../components/ReqPaperReqStatus";
import {
  faClock,
  faBell,
  faComments,
  faHandshake,
  faAngleUp,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";
import { MyServantData } from "../../Entities";
import "./index.scss";
import Divider from "@material-ui/core/Divider";
import Paper from "../../../../Components/Paper";
import Button from "../../../../Components/Button";
import HeaderItem from "../../../../Components/ReqPaperHeaderItem";
import { toPersianNumber } from "../../../../Components/hooks/persianHelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  titleReportRequest,
  iconReportRequest,
} from "../../../components/ReqPaperReqStatus/statusEnumContainer";
import ShowConversations from "../../../../ShowConversations";
import { useHistory } from "react-router-dom";
import { showLocalStorage } from "../../../../Routers/localStorage";

type Props = {
  item: MyServantData;
};

function RequestPaper({ item }: Props) {
  const [showDetails, setShowDetails] = useState(false);
  const storageUser = showLocalStorage("user");
  const [time, setTime] = useState<string>();
  const [date, setDate] = useState<string>();
  const [showConversationPopup, setShowConversationPopup] =
    useState<boolean>(false);
  const history = useHistory();

  useEffect(() => {
    if (storageUser != null) {
      DateTime();
    }
  }, []);

  const DateTime = () => {
    const date = item.requestDate;
    let splitDate = date.split(" ");
    setDate(toPersianNumber(splitDate[0]));
    setTime(toPersianNumber(splitDate[1]));
  };

  const ShowDetailRequest = () => {
    if (item.requestRegistrationId != null) {
      history.push(`/DetailRequest/${item.requestRegistrationId}`);
    }
  };

  return (
    <Paper className="myservices-req-paper">
      <header className="myservices-req-paper-header">
        <div className="myservices-req-paper-status-wrapper">
          <RequestStatus
            title={titleReportRequest(item.status)}
            icon={iconReportRequest(item.status)}
          />
          {/* Maybe sth gets added here otherwise the wrapper is not needed. */}
        </div>
        <div className="myservices-req-paper-header-items-wrapper">
          <HeaderItem
            icon={faBell}
            iconClassName={
              item.requestType === 1 ? "myreqs-req-paper-emergent-icon" : ""
            }
          >
            {item.requestType === 1 ? "فوری" : "عادی"}
          </HeaderItem>
          <HeaderItem icon={item.presenceType === 0 ? faHandshake : faComments}>
            {item.presenceType === 0 ? "حضوری" : "غیر حضوری"}
          </HeaderItem>
          <HeaderItem icon={faClock}>
            <div className="req-paper-date-time">
              <span>{date}</span>
              <span className="datetime-dash-seperator">-</span>
              <span>{time}</span>
            </div>
          </HeaderItem>
        </div>
      </header>
      <Divider className="myservices-req-paper-main-divider" />
      <main className="myservices-req-paper-main">
        <div className="myservices-req-paper-title-more">
          <p className={"myservices-req-paper-title-normal"}>
            {toPersianNumber(item.title)}
            <span className="myservices-req-paper-title-servant">
              ( {item.firstName} {item.lastName})
            </span>
          </p>
          <FontAwesomeIcon
            icon={showDetails ? faAngleUp : faAngleDown}
            className="myservices-req-paper-more-details"
            onClick={() => setShowDetails((prev) => !prev)}
          />
        </div>
        {showDetails && (
          <div className="myservices-req-paper-details">
            <div className="myservices-req-paper-details-item">
              <span>تاریخ پذیرش</span>
              <span>{toPersianNumber(item.acceptanceDate)}</span>
            </div>
            {item.confirmWorkDate && (
              <div className="myservices-req-paper-details-item">
                <span>تاریخ تایید</span>
                <span>{toPersianNumber(item.confirmWorkDate)}</span>
              </div>
            )}
            {item.canceledDate && (
              <>
                <div className="myservices-req-paper-details-item">
                  <span>تاریخ لغو</span>
                  <span>{toPersianNumber(item.canceledDate)}</span>
                </div>
                <div className="myservices-req-paper-details-item">
                  <span>کاربر لغو کننده</span>
                  <span>{item.canceledUserName}</span>
                </div>
              </>
            )}
          </div>
        )}
        <footer className="myservices-req-paper-footer-btns-wrapper">
          <Button label="جزئیات" onClick={ShowDetailRequest} color="blue" />
          <Button
            label="گفتگوها"
            onClick={() => setShowConversationPopup(true)}
            color="blue"
            variant="outlined"
          />
        </footer>
      </main>
      {showConversationPopup && (
        <ShowConversations
          reqConfirmId={item.id}
          open={showConversationPopup}
          setOpen={setShowConversationPopup}
          whichOne={false}
        />
      )}
    </Paper>
  );
}

export default RequestPaper;
