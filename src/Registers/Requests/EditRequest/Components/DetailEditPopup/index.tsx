import { useState, useEffect } from "react";
import TextFieldm from "../../../../../Components/TextField";
import Button from "../../../../../Components/Button";
import UploadFileInput, {
  IEditFile,
} from "../../../../../Components/FileUploader";
import Popup from "../../../../../Components/Popup";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "../../../DetailsPopup.scss";
import { TextField } from "@material-ui/core";
import { RequestType } from "../../../../../Models/Enums";

export interface detailCallBack {
  details: string;
  fileList: IEditFile[];
}

type props = {
  onConfirm: (detail: detailCallBack) => void;
  handleClose: () => void;
  fileSize: number;
  requestType: RequestType;
  fileCount: number;
  hour: number;
  details: string;
  files?: File[];
  editFiles?: IEditFile[];
  open: boolean;
  onClose: () => void;
};

const DetailsEditPopup = ({
  onConfirm,
  handleClose,
  fileSize,
  fileCount,
  hour,
  details,
  open,
  editFiles,
  onClose,
  requestType,
}: props) => {
  const matchesSm = useMediaQuery("(max-width:40rem)");

  const [currentDetails, setcurrentDetails] = useState("");
  const [currentFiles, setCurrentFiles] = useState<IEditFile[]>([]);

  useEffect(() => {
    if (open) {
      setcurrentDetails(details);
    }
  }, [open]);

  const onSubmit = async () => {
    onConfirm({
      details: currentDetails,
      fileList: currentFiles,
    });
  };

  return (
    <Popup className="upsert-details-popup" {...{ open, onClose }}>
      <div className="upsert-details-fields-grid-wrapper">
        <div className="upsert-details-fields-grid-item-1">
          <TextField
            value={hour}
            type="number"
            variant="standard"
            size="small"
            disabled
            label="مدت زمان نمایش درخواست"
            helperText={
              requestType === RequestType.Emergency
                ? "مدت زمان نمایش به ساعت می باشد "
                : "مدت زمان نمایش به روز می باشد"
            }
            fullWidth
            style={{ pointerEvents: "none" }}
          />
        </div>
        <div className="upsert-details-fields-grid-item-2">
          <TextFieldm
            label="توضیحات درخواست"
            value={currentDetails}
            onTextChange={(e) => {
              if (e.length <= 500) setcurrentDetails(e);
            }}
            multiline
            rows={3}
          />
        </div>
        <div className="upsert-details-fields-grid-item-3">
          <UploadFileInput
            fileCount={fileCount}
            fileSize={fileSize}
            editFiles={editFiles}
            label="فایلهای پیوست "
            onFileChanged={(s) => {
              setCurrentFiles(s);
            }}
          />
        </div>
      </div>
      <div className="upsert-details-btns-wrapper">
        <Button
          label="تایید"
          onClick={onSubmit}
          size={matchesSm ? "xs" : "sm"}
        />
        <Button
          label="انصراف"
          color="blue"
          className="upsert-details-back-btn"
          onClick={handleClose}
          size={matchesSm ? "xs" : "sm"}
          variant="outlined"
        />
      </div>
    </Popup>
  );
};

export default DetailsEditPopup;
