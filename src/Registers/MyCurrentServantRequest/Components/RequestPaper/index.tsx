import {
  faClock,
  faBell,
  faComments,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";
import { CurrentList } from "../../Entites";
import "./index.scss";
import Divider from "@material-ui/core/Divider";
import Paper from "../../../../Components/Paper";
import Button from "../../../../Components/Button";
import HeaderItem from "../../../../Components/ReqPaperHeaderItem";
import RequestStatus from "../../../components/ReqPaperReqStatus";
import { toPersianNumber } from "../../../../Components/hooks/persianHelper";
import { useHistory } from "react-router-dom";
import {
  titleReportRequest,
  iconReportRequest,
} from "../../../components/ReqPaperReqStatus/statusEnumContainer";
import { RequestStepServant } from "../../../../Models/Enums";

type Props = {
  item: CurrentList;
  callBackWhereRequest: (
    requestConfirmId: string,
    RequestStepServant: RequestStepServant,
    RequestStepServantId: string
  ) => void;
};

function RequestPaper({ item, callBackWhereRequest }: Props) {
  const history = useHistory();

  const persianText = (text: any) => {
    if (text) {
      return toPersianNumber(text);
    }
    return "";
  };

  const ShowDetailRequest = () => {
    if (item.requestRegistrationId != null) {
      history.push(`/DetailRequest/${item.requestRegistrationId}`);
    }
  };

  return (
    <Paper className="currentreqs-req-paper">
      <header className="currentreqs-req-paper-header">
        <div className="currentreqs-req-paper-status-wrapper">
          <RequestStatus
            title={titleReportRequest(item.reportRequestStatus)}
            icon={iconReportRequest(item.reportRequestStatus)}
          />
          {/* The wrapper exists because perhaps some other child gets added to it. */}
        </div>
        <div className="currentreqs-req-paper-header-items-wrapper">
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
              <span>{persianText(item.beginDate)}</span>
              <span className="datetime-dash-seperator">-</span>
              <span>{persianText(item.beginTime)}</span>
            </div>
          </HeaderItem>
        </div>
      </header>
      <Divider className="currentreqs-req-paper-main-divider" />
      <main className="currentreqs-req-paper-main">
        <p className={"currentreqs-req-paper-title-normal"}>
          <span>{toPersianNumber(item.title)}</span>
          <span className="currentreqs-req-paper-title-servant">
            ({item.firsName} {item.lastName})
          </span>
        </p>
        <footer className="currentreqs-req-paper-footer-btns-wrapper">
          <Button
            label="پیگیری"
            onClick={() => {
              callBackWhereRequest(
                item.requestConfirmId,
                item.requestStep,
                item.stepId
              );
            }}
            color="blue"
          />
          <Button
            label="جزئیات"
            variant="outlined"
            onClick={ShowDetailRequest}
            color="blue"
          />
        </footer>
      </main>
    </Paper>
  );
}

export default RequestPaper;
