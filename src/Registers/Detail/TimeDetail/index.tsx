import "./index.scss";
import { IRegisterSave } from "../../MyRequestList/Entities";
import { TextField } from "@material-ui/core";
import Paper from "../../../Components/Paper";
import { toPersianNumber } from "../../../Components/hooks/persianHelper";
import DetailAttachment from "../../../Components/DetailAttachment";
import * as service from "../../MyRequestList/IService";
import { RequestType } from "../../../Models/Enums";

type props = {
  item: IRegisterSave | undefined;
};

function TimeDetail({ item }: props) {
  const TimeToShow = (expiration: number, requestType: RequestType) => {
    const PersianTime = toPersianNumber(expiration as number);
    if (requestType === RequestType.Emergency) {
      return PersianTime + "ساعت";
    } else return PersianTime + "روز";
  };

  const persianText = (text: string) => {
    if (text) {
      return toPersianNumber(text);
    }
    return "";
  };

  return (
    <Paper className="req-details-paper">
      <div className="details-time-grid-container">
        <div className="details-time-grid-item1">
          <TextField
            fullWidth
            label="تاریخ انجام درخواست"
            disabled
            variant="standard"
            size="small"
            value={persianText(item?.beginDate!)}
            inputProps={{ dir: "ltr" }}
            style={{ pointerEvents: "none" }}
          />
        </div>
        <div className="details-time-grid-item2">
          <TextField
            fullWidth
            label="زمان انجام درخواست"
            disabled
            variant="standard"
            size="small"
            value={persianText(item?.beginTime!)}
            inputProps={{ dir: "ltr" }}
            style={{ pointerEvents: "none" }}
          />
        </div>
        <div className="details-time-grid-item3">
          <TextField
            fullWidth
            label="تاریخ انقضا"
            disabled
            variant="standard"
            size="small"
            value={persianText(item?.expirationDate!)}
            inputProps={{ dir: "ltr" }}
            style={{ pointerEvents: "none" }}
          />
        </div>
        <div className="details-time-grid-item4">
          <TextField
            fullWidth
            label="مدت زمان نمایش"
            disabled
            variant="standard"
            size="small"
            value={TimeToShow(item?.expiration!, item?.requestType!)}
            style={{ pointerEvents: "none" }}
          />
        </div>
        <div className="details-time-grid-item5">
          <div className="details-time-attachments-wrapper">
            <p className="details-time-attachments-heading">فایل های پیوست</p>
            {item?.attachments && (
              <DetailAttachment
                attachments={item.attachments}
                getFileAttachment={service.getFileMsg}
              />
            )}
          </div>
        </div>
      </div>
    </Paper>
  );
}
export default TimeDetail;
