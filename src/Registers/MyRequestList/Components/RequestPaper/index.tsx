import React, { useState, useEffect } from "react";
import {
  faClock,
  faBell,
  faComments,
  faHandshake,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import "./index.scss";
import { MyRequestData } from "../../Entities";
import Divider from "@material-ui/core/Divider";
import Paper from "../../../../Components/Paper";
import Button from "../../../../Components/Button";
import HeaderItem from "../../../../Components/ReqPaperHeaderItem";
import RequestStatusForm from "../../../components/ReqPaperReqStatus";
import Popup from "../../../../Components/Popup";
import {
  titleRequestStatus,
  iconRequestStatus,
} from "../../../components/ReqPaperReqStatus/statusEnumContainer";
import { toPersianNumber } from "../../../../Components/hooks/persianHelper";
import { useHistory } from "react-router-dom";
import { RequestStatus } from "../../../../Models/Enums";
import { showLocalStorage } from "../../../../Routers/localStorage";
import TextField from "../../../../Components/TextField";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { toast } from "react-toastify";

type Props = {
  item: MyRequestData;
  callBackRemoveRequest: (id: string) => void;
  EditedFormMyRequest: (requestRegistrationId: string) => void;
};

function RequestPaper({
  item,
  callBackRemoveRequest,
  EditedFormMyRequest,
}: Props) {
  const msg5 = "درخواست منقضی شده و امکان ویرایش ندارد.";
  const matchesSm = useMediaQuery("(max-width:40rem)");
  const storageUser = showLocalStorage("user");
  const history = useHistory();
  const [time, setTime] = useState<string>();
  const [date, setDate] = useState<string>();
  const [openDetailReject, setOpenDetailReject] = useState<boolean>(false);

  useEffect(() => {
    if (storageUser != null) {
      DateTime();
    }
  }, []);

  const ShowClientRequest = () => {
    if (item.id !== null) {
      history.push(`/DetailRequestClient/${item.id}`);
    }
  };

  const ShowDetailRequest = () => {
    if (item.id != null) {
      history.push(`/DetailRequest/${item.id}`);
    }
  };

  const DateTime = () => {
    const data = item.requestDate;
    let splitDate = data.split(" ");
    setDate(toPersianNumber(splitDate[0]));
    setTime(toPersianNumber(splitDate[1]));
  };

  const cancellationMyRequest = (Status: RequestStatus) => {
    if (
      Status === RequestStatus.Pending ||
      Status === RequestStatus.Presentable ||
      Status === RequestStatus.Reject
    ) {
      return true;
    }
    return false;
  };

  const EditRequest = (Status: RequestStatus) => {
    if (
      Status === RequestStatus.Reject ||
      Status === RequestStatus.Presentable
    ) {
      return true;
    }
    return false;
  };

  return (
    <>
      <Paper className="myreqs-req-paper">
        <header className="myreqs-req-paper-header">
          <div className="myreqs-req-paper-status-eye-wrapper">
            <RequestStatusForm
              title={titleRequestStatus(item.requestStatus)}
              icon={iconRequestStatus(item.requestStatus)}
            />
            <HeaderItem icon={faEye}>
              {toPersianNumber(item.viewCount)}
            </HeaderItem>
          </div>
          <div className="myreqs-req-paper-header-items-wrapper">
            <HeaderItem
              icon={faBell}
              iconClassName={
                item.requestType === 1 ? "myreqs-req-paper-emergent-icon" : ""
              }
            >
              {item.requestType === 1 ? "فوری" : "عادی"}
            </HeaderItem>
            <HeaderItem
              icon={item.presenceType === 0 ? faHandshake : faComments}
            >
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
        <Divider className="myreqs-req-paper-main-divider" />
        <main className="myreqs-req-paper-main">
          <p className={"myreqs-req-paper-title-normal"}>
            {toPersianNumber(item.title)}
          </p>
          {/* <p className="myreqs-req-paper-description">
          {truncateString(persianText(item.content), 50)}
        </p> */}
          <footer className="myreqs-req-paper-footer-btns-wrapper">
            <Button label="جزئیات" onClick={ShowDetailRequest} color="blue" />
            {item.requestStatus != 2 ? (
              <Button
                label="همیاران"
                variant="outlined"
                onClick={ShowClientRequest}
                color="blue"
              />
            ) : (
              <Button
                label="علت رد"
                variant="outlined"
                onClick={() => {
                  setOpenDetailReject(true);
                }}
                color="red"
              />
            )}
            {EditRequest(item.requestStatus) && (
              <Button
                label="ویرایش"
                onClick={() => {
                  if (item.isExpired) {
                    toast.error(msg5);
                    return;
                  }
                  EditedFormMyRequest(item.id);
                }}
                color="orange"
              />
            )}
            {cancellationMyRequest(item.requestStatus) && (
              <Button
                label="لغو"
                variant="outlined"
                onClick={() => {
                  callBackRemoveRequest(item.id);
                }}
                color="red"
              />
            )}
          </footer>
        </main>
      </Paper>
      {item.rejectReason && (
        <Popup
          open={openDetailReject}
          className="show-reject-request-popup"
          onClose={() => setOpenDetailReject(false)}
        >
          <header className="show-reject-request-header">
            {toPersianNumber(item.title)}
          </header>
          <Divider className="show-reject-request-main-divider" />
          <div className="description-reject-display">
            <TextField
              label="علت عدم تایید درخواست"
              value={toPersianNumber(item.rejectReason)}
              disabled
              multiline
              rows={3}
            />
          </div>
          <div className="show-reject-request-btn-wrapper">
            <Button
              label="بازگشت"
              onClick={() => setOpenDetailReject(false)}
              color="blue"
              size={matchesSm ? "xs" : "sm"}
            />
          </div>
        </Popup>
      )}
    </>
  );
}

export default RequestPaper;
