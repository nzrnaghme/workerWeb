import React, { useState } from "react";
import RequestStatusForm from "../../../../components/ReqPaperReqStatus";
import "./index.scss";
import Divider from "@material-ui/core/Divider";
import Paper from "../../../../../Components/Paper";
import Button from "../../../../../Components/Button";
import { toPersianNumber } from "../../../../../Components/hooks/persianHelper";
import { RequestServant } from "../../../Entities";
import {
  titleReportRequest,
  iconReportRequest,
} from "../../../../components/ReqPaperReqStatus/statusEnumContainer";
import ShowConversations from "../../../../../ShowConversations";

type Props = {
  item: RequestServant;
};

function ServantPaper({ item }: Props) {
  const [showConversationPopup, setShowConversationPopup] =
    useState<boolean>(false);

  return (
    <Paper className="servant-paper">
      <header className="servant-paper-header">
        <RequestStatusForm
          title={titleReportRequest(item.status)}
          icon={iconReportRequest(item.status)}
        />
        <p className="servant-paper-title">
          {toPersianNumber(item.servantFullName)}
        </p>
      </header>
      <Divider className="servant-paper-main-divider" />
      <main className="servant-paper-main">
        <div className="servant-paper-details">
          <div className="servant-paper-details-item">
            <span>تاریخ پذیرش درخواست</span>
            <span>{toPersianNumber(item.acceptanceDate)}</span>
          </div>
          {item.confirmedDate && (
            <div className="servant-paper-details-item">
              <span>تاریخ تایید درخواست</span>
              <span>{toPersianNumber(item.confirmedDate)}</span>
            </div>
          )}
          {item.canceledDate && (
            <>
              <div className="servant-paper-details-item">
                <span>تاریخ لغو درخواست</span>
                <span>{toPersianNumber(item.canceledDate)}</span>
              </div>
              <div className="servant-paper-details-item">
                <span>کاربر لغو کننده</span>
                <span>{item.canceledUserName}</span>
              </div>
            </>
          )}
        </div>
        <footer className="servant-paper-footer-btns-wrapper">
          <Button
            label="گفتگوها"
            onClick={() => setShowConversationPopup(true)}
            color="blue"
          />
        </footer>
      </main>
      {showConversationPopup && (
        <ShowConversations
          reqConfirmId={item.id}
          open={showConversationPopup}
          setOpen={setShowConversationPopup}
          whichOne={true}
        />
      )}
    </Paper>
  );
}

export default ServantPaper;
