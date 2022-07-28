import { useEffect, useRef, useState } from "react";
import { IMessage } from "../../../../Models/Entities";
import { FileType } from "../../../../Models/Enums";
import "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckDouble,
  faDownload,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ButtonBase from "@material-ui/core/ButtonBase";
import { MsgsState } from "../../../../Models/Enums";
import { truncateString } from "../../../hooks/stringHelper";
import { toPersianNumber } from "../../../hooks/persianHelper";
import { fileIconSupplier } from "../../../hooks/fileHelper";
import { toast } from "react-toastify";
import { useGeneralContext } from "../../../../Providers/GeneralContext";
import moment from "moment";
import soundWaveImg from "../../../../Images/sound-wave.png";
import AudioPlayer from "../../../../Components/AudioPlayer";
import * as service from "../../Service";
interface MsgProps {
  msg: IMessage;
}

interface FileMsgProps extends MsgProps {
  connection: signalR.HubConnection;
  msg: IMessage;
  msgsState: MsgsState;
  fromShowConversations: boolean;
  clientId?: string;
  servantId?: string;
  call: (id: IMessage) => void;
  state: MsgsState;
}

interface NoMessageHintProps {
  hint: string;
}

const datetimeAndStatus = (msg: IMessage) => (
  <span className="MsgDeliveryDetailsContainer">
    {msg.isReceived && (
      <FontAwesomeIcon icon={faCheckDouble} style={{ marginLeft: "0.25rem" }} />
    )}
    {toPersianNumber(msg.sendDate)}
  </span>
);

export function TextMessage({ msg }: MsgProps) {
  return (
    <div
      className={`Message ${msg.isMine ? "IsMine" : "IsNotMine"}`}
      key={msg.id}
    >
      <div>{msg.message}</div>
      {datetimeAndStatus(msg)}
    </div>
  );
}

export function FileMessage({
  msg,
  msgsState,
  fromShowConversations,
  call,
  state,
}: FileMsgProps) {
  const [base64File, setBase64File] = useState("");
  const fileDownloader = useRef<HTMLAnchorElement>(null);
  const voiceDownloader = useRef<HTMLDivElement>(null);
  const matchesSm = useMediaQuery("(max-width:40rem)");
  const { onConfirmSetter, setConfirmPopupOpen } = useGeneralContext();

  const isVoice = msg.fileMessage.fileType === FileType.RecordedAudio;

  useEffect(() => {
    if (!isVoice || !msg.isMine) return;
    voiceDownloader.current!.click();
  }, [msg]);

  useEffect(() => {
    if (!base64File || isVoice) return;
    fileDownloader.current!.click();
    setBase64File("");
  }, [base64File]);

  const onDownloadingByStateAndFileId = async (
    fileId: string,
    state: MsgsState
  ) => {
    const { Data } = await service.getFileMsg(fileId, state);
    setBase64File(Data);
  };

  const fileDownloadHandler = (fileId: string, state: MsgsState) => {
    onDownloadingByStateAndFileId(fileId, state);
  };

  const fileNameTruncator = (fileName: string | null) => {
    if (!fileName) return "anonymous";

    let truncated;
    if (matchesSm) {
      truncated = truncateString(fileName, 9);
    }
    truncated = truncateString(fileName, 18);
    return truncated;
  };

  const confirmDelete = (msg: IMessage) => {
    if (state === msgsState) {
      const d = moment(new Date(msg.date ?? 0))
        .add(30, "minutes")
        .toISOString();
      const now = moment(new Date())
        .add(3, "hours")
        .add(30, "minutes")
        .toISOString();
      if (d > now) {
        onConfirmSetter("آیا مطمئن هستید می خواهید فایل را حذف کنید؟", () =>
          call(msg)
        );
        setConfirmPopupOpen(true);
      } else {
        toast.warning("امکان حذف وجود ندارد.");
      }
    } else {
      toast.warning("امکان حذف وجود ندارد.");
    }
  };

  return (
    <>
      {isVoice ? (
        <div
          className={`Message FileMessage voice ${
            msg.isMine ? "IsMine" : "IsNotMine"
          }`}
          onClick={() => {
            fileDownloadHandler(msg.id, msgsState);
          }}
          key={msg.id}
          ref={voiceDownloader}
        >
          {base64File ? (
            <>
              {/* <audio controls>
                <source src={base64File} type="audio/mpeg" />
                <source src="media/sound.ogg" type="audio/ogg" />
                <source src="media/sound.wav" type="audio/wav" />
                Your browser does not support the audio element.
              </audio> */}
              <AudioPlayer src={base64File} className="chat-audio-player" />

              {msg.isMine && (
                <ButtonBase
                  className="file-remove-btn IsMineBtn"
                  onClick={() => confirmDelete(msg)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </ButtonBase>
              )}
              <span className="FileSize">
                {msg.fileMessage.fileSize! < 1000000
                  ? toPersianNumber(
                      (msg.fileMessage.fileSize! / 1024).toFixed(2)
                    )
                  : toPersianNumber(
                      (msg.fileMessage.fileSize! / 1024 / 1024).toFixed(2)
                    )}
                <span>{msg.fileMessage.fileSize! < 1000000 ? "KB" : "MB"}</span>
              </span>
            </>
          ) : (
            <div className="voice-downloader">
              <div className="sound-wave-wrapper">
                <img src={soundWaveImg} alt="sound-wave" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`Message FileMessage ${
            msg.isMine ? "IsMine" : "IsNotMine"
          }`}
          key={msg.id}
        >
          <div style={{ flex: 1 }}>
            <div className="MsgInfoAndDownloadBtnContainer">
              <div className="FileBtnsAndStatusContainer">
                <div className="file-btns-wrapper">
                  <ButtonBase
                    onClick={() => {
                      fileDownloadHandler(msg.id, msgsState);
                    }}
                    className={`FileDownloadBtn ${
                      msg.isMine ? "IsMineBtn" : "IsNotMineBtn"
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={faDownload}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    />
                  </ButtonBase>
                  {msg.isMine && (
                    <ButtonBase
                      className="file-remove-btn IsMineBtn"
                      onClick={() => confirmDelete(msg)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </ButtonBase>
                  )}
                </div>
                {datetimeAndStatus(msg)}
              </div>
              <div className="FileInfoContainer">
                <span>{fileNameTruncator(msg.fileMessage.name!)}</span>
                <span className="FileSize">
                  {msg.fileMessage.fileSize! < 1000000
                    ? toPersianNumber(
                        (msg.fileMessage.fileSize! / 1024).toFixed(2)
                      )
                    : toPersianNumber(
                        (msg.fileMessage.fileSize! / 1024 / 1024).toFixed(2)
                      )}
                  <span>
                    {msg.fileMessage.fileSize! < 1000000 ? "KB" : "MB"}
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="FileTypeIcon">
            {
              <img
                src={fileIconSupplier(msg.fileMessage.fileType!)}
                style={{ width: "100%" }}
                alt="fileIcon"
              />
            }
          </div>
        </div>
      )}
      <a
        hidden
        href={base64File}
        download={msg.fileMessage.name + "." + msg.fileMessage.fileExtension}
        ref={fileDownloader}
      />
    </>
  );
}

export function NoMessageHint({ hint }: NoMessageHintProps) {
  return <div className="Message IsNotMine NoMsgsYet">{hint}</div>;
}
