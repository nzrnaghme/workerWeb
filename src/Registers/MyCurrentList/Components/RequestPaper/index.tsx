import React from "react";
import {
  faClock,
  faBell,
  faComments,
  faHandshake,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import "./index.scss";
import Divider from "@material-ui/core/Divider";
import Paper from "../../../../Components/Paper";
import Button from "../../../../Components/Button";
import HeaderItem from "../../../../Components/ReqPaperHeaderItem";
import RequestStatus from "../../../components/ReqPaperReqStatus";
import { toPersianNumber } from "../../../../Components/hooks/persianHelper";
import { useHistory } from "react-router-dom";
import { CurrentList } from "../../Entites";
import {
  titleReportRequest,
  iconReportRequest,
} from "../../../components/ReqPaperReqStatus/statusEnumContainer";
import { RequestStepServant } from "../../../../Models/Enums";

type Props = {
  item: CurrentList;
  callBackWhereRequest: (
    stepId: string,
    requestStep: RequestStepServant,
    requestConfirmId: string
  ) => void;
};

function RequestPaper({ item, callBackWhereRequest }: Props) {
  const history = useHistory();

  const persianText = (text: string | undefined) => {
    if (text) {
      return toPersianNumber(text);
    } else {
      return "";
    }
  };

  const ShowDetailRequest = () => {
    if (item.requestRegistrationId != null) {
      history.push(`/DetailRequest/${item.requestRegistrationId}`);
    }
  };

  return (
    <Paper className="currentservices-req-paper">
      <header className="currentservices-req-paper-header">
        <div className="currentservices-req-paper-status-wrapper">
          <RequestStatus
            title={titleReportRequest(item.reportRequestStatus)}
            icon={iconReportRequest(item.reportRequestStatus)}
          />
          <HeaderItem icon={faEye}>
            {toPersianNumber(item.viewCount)}
          </HeaderItem>
        </div>
        <div className="currentservices-req-paper-header-items-wrapper">
          <HeaderItem
            icon={faBell}
            iconClassName={
              item.requestType === 1
                ? "currentservices-req-paper-emergent-icon"
                : ""
            }
          >
            {item.requestType === 1 ? "فوری" : "عادی"}
          </HeaderItem>
          <HeaderItem icon={item.presenceType === 0 ? faHandshake : faComments}>
            {item.presenceType === 0 ? "حضوری" : "غیر حضوری"}
          </HeaderItem>
          <HeaderItem icon={faClock}>
            <div className="req-paper-date-time">
              <span>{persianText(item.beginDate)}</span>
              <span className="datetime-dash-seperator">-</span>
              <span>{persianText(item.beginTime)}</span>
            </div>
          </HeaderItem>
        </div>
      </header>
      <Divider className="currentservices-req-paper-main-divider" />
      <main className="currentservices-req-paper-main">
        <p className={"currentservices-req-paper-title-normal"}>
          <span>{toPersianNumber(item.title)}</span>
          <span className="currentservices-req-paper-title-servant">
            ( {item.servantFirsName} {item.servantLastName})
          </span>
        </p>
        <footer className="currentservices-req-paper-footer-btns-wrapper">
          <Button
            label="پیگیری"
            variant="outlined"
            onClick={() => {
              callBackWhereRequest(
                item.stepId,
                item.requestStep,
                item.requestConfirmId
              );
            }}
            color="blue"
          />
          <Button label="جزئیات" onClick={ShowDetailRequest} color="blue" />
        </footer>
      </main>
    </Paper>
  );
}

export default RequestPaper;
