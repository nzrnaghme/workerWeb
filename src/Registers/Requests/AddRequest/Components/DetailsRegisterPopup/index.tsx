import { useState, useEffect } from "react";
import TextFieldm from "../../../../../Components/TextField";
import Button from "../../../../../Components/Button";
import { RequestType } from "../../../../../Models/Enums";
import { Formik, Form } from "formik";
import UploadFileInput, {
  IEditFile,
} from "../../../../../Components//FileUploader/UploadAddRequest";
import Popup from "../../../../../Components/Popup";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "../../../DetailsPopup.scss";
import {
  toEnglishNumber,
  toPersianNumber,
} from "../../../../../Components/hooks/persianHelper";
import { FormHelperText, TextField } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import ButtonBase from "@material-ui/core/ButtonBase";

export interface detailCallBack {
  hour: number;
  details: string;
  fileList: IEditFile[];
}

type props = {
  onConfirm: (detail: detailCallBack) => void;
  handleClose: () => void;
  requestType: RequestType;
  activityDurationEmergency: number;
  activityDurationNormal: number;
  fileSize: number;
  fileCount: number;
  hour: number | undefined;
  details: string;
  files: IEditFile[];
  open: boolean;
  onClose: () => void;
};

const DetailsRegisterPopup = ({
  onConfirm,
  handleClose,
  activityDurationEmergency,
  activityDurationNormal,
  fileSize,
  fileCount,
  hour,
  details,
  files,
  open,
  onClose,
  requestType,
}: props) => {
  const matchesSm = useMediaQuery("(max-width:40rem)");

  const [currentDetails, setcurrentDetails] = useState("");
  const [currentFiles, setCurrentFiles] = useState<IEditFile[]>([]);
  const [showRequest, setShowRequest] = useState<number>(1);

  useEffect(() => {
    setcurrentDetails(details);
  }, [details]);

  useEffect(() => {
    if (open) {
      if (hour) {
        setShowRequest(hour);
      } else {
        if (requestType === RequestType.Emergency)
          setShowRequest(activityDurationEmergency);
        else setShowRequest(1);
      }
    }
  }, [open]);

  const onSubmit = async () => {
    onConfirm({
      hour: Number(toEnglishNumber(showRequest.toString())),
      details: currentDetails,
      fileList: currentFiles,
    });
  };

  return (
    <Popup className="upsert-details-popup" {...{ open, onClose }}>
      <div className="upsert-details-fields-grid-wrapper">
        <div className="upsert-details-fields-grid-item-1">
          <TextField
            name="hour"
            value={toPersianNumber(showRequest)}
            onChange={(c: any) => {
              setShowRequest(c);
            }}
            variant="standard"
            size="small"
            type="text"
            label="مدت زمان نمایش درخواست"
            inputProps={{
              maxlength: "2",
              dir: "ltr",
              readOnly: true,
            }}
            fullWidth
            className="req-display-days"
          />
          <ButtonBase
            className="arrow-btn-up"
            onClick={(c: any) => {
              if (requestType === RequestType.Normal) {
                if (showRequest != activityDurationNormal)
                  setShowRequest(showRequest + 1);
              } else {
                if (showRequest != activityDurationEmergency)
                  setShowRequest(showRequest + 1);
              }
            }}
          >
            <FontAwesomeIcon icon={faAngleUp} className="up-icon" />
          </ButtonBase>
          <ButtonBase
            className="arrow-btn-down"
            onClick={(c: any) => {
              if (showRequest != 1) setShowRequest(showRequest - 1);
            }}
          >
            <FontAwesomeIcon icon={faAngleDown} className="down-icon" />
          </ButtonBase>
          <FormHelperText style={{ marginRight: "1%" }}>
            {requestType === RequestType.Emergency
              ? "مدت زمان نمایش به ساعت می باشد "
              : "مدت زمان نمایش به روز می باشد"}
          </FormHelperText>
        </div>
        <div className="upsert-details-fields-grid-item-2">
          <TextFieldm
            label="توضیحات درخواست"
            value={toPersianNumber(currentDetails)}
            onTextChange={(e) => {
              if (e.length <= 500) setcurrentDetails(e);
            }}
            multiline
          />
        </div>
        <div className="upsert-details-fields-grid-item-3">
          <UploadFileInput
            fileCount={fileCount}
            fileSize={fileSize}
            editFiles={files}
            label="فایلهای پیوست"
            onFileChanged={setCurrentFiles}
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
          color="red"
          className="upsert-details-back-btn"
          onClick={handleClose}
          size={matchesSm ? "xs" : "sm"}
          variant="outlined"
        />
      </div>
    </Popup>
  );
};

export default DetailsRegisterPopup;
