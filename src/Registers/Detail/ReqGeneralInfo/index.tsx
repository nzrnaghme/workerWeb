import "./index.scss";
import { IRegisterSave } from "../../MyRequestList/Entities";
import Paper from "../../../Components/Paper";
import TextField from "../../../Components/TextField";
import { PresenceTypeCategory, RequestType } from "../../../Models/Enums";
import { toPersianNumber } from "../../../Components/hooks/persianHelper";

type props = {
  item: IRegisterSave | undefined;
};

function ReqGeneralInfo({ item }: props) {
  const TypeWork = (presenceType: PresenceTypeCategory | undefined) => {
    switch (presenceType) {
      case 0:
        return "حضوری";
      case 1:
        return "غیرحضوری";
    }
  };
  const TypeRequest = (requestType: RequestType | undefined) => {
    switch (requestType) {
      case 0:
        return "عادی";
      case 1:
        return "فوری";
    }
  };
  return (
    <Paper className="req-details-paper">
      <div className="details-general-info-grid-container">
        <div className="details-general-info-grid-item1">
          <TextField
            label="عنوان درخواست"
            disabled
            value={toPersianNumber(item!.title)}
            className="disable-textfield"
          />
        </div>
        <div className="details-general-info-grid-item2">
          <TextField
            label="نحوه انجام کار"
            disabled
            value={TypeWork(item!.presenceType)!}
            className="disable-textfield"
          />
        </div>
        <div className="details-general-info-grid-item3">
          <TextField
            label="دسته بندی درخواست"
            disabled
            value={TypeRequest(item!.requestType)!}
            className="disable-textfield"
          />
        </div>
        <div className="details-general-info-grid-item4">
          <TextField
            label="توضیحات درخواست"
            disabled
            value={toPersianNumber(item!.content ?? "")}
            multiline
            rows={!item!.content ? 1 : 4}
          />
        </div>
        <div className="details-general-info-grid-item5">
          <TextField
            label="زمینه درخواست"
            disabled
            value={item!.categoryName}
            className="disable-textfield"
          />
        </div>
      </div>
    </Paper>
  );
}
export default ReqGeneralInfo;
