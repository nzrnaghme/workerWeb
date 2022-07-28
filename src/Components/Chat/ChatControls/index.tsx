import { useEffect, useRef, useState } from "react";
import "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonBase from "@material-ui/core/ButtonBase";
import {
  faMicrophone,
  faPaperPlane,
  faPaperclip,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { FileType } from "../../../Models/Enums";

import {
  audioFormats,
  docFormats,
  videoFormats,
  imageFormats,
  IChatGlobalConfigs,
  IFileUploaded,
} from "../../../Models/Entities";
import imagePicker from "../../FileUploader/imagePicker";

const uploadAcceptedFormats =
  ".jpeg,.png,.gif,.jpg,.bmp,.Mkv,.Mp4,.3gp,.Mp3,.wma,.m4a,.doc,.docx,.xls,.xlsx,.rtf,.txt,.pdf";

const notSupported = "این فرمت فایل، پشتیبانی نمی شود.";
const picSizeExceeded = "حجم عکس بیش از حد مجاز است.";
const fileSizeExceeded = "حجم فایل بیش از حد مجاز است.";

type Props = {
  onFileDelivered: (
    file: string,
    fileType: FileType,
    fileExtension: string,
    fileSize: number
  ) => void;
  insertMsgInvoker: (
    text: string,
    id?: string,
    dataFile?: IFileUploaded | null
  ) => void;
  disabled?: boolean;
  chatGlobalConfigs: IChatGlobalConfigs;
};

function ChatControls({
  onFileDelivered,
  insertMsgInvoker,
  disabled,
  chatGlobalConfigs,
}: Props) {
  const [mediaRecorder, setMediaRecorder] = useState<any>(null);
  const [recording, setRecording] = useState(false);
  const fileUploader = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!mediaRecorder) return;

    recordAudioMsg();
  }, [mediaRecorder]);

  const handleMicrophone = () => {
    if (!mediaRecorder) {
      try {
        navigator.mediaDevices
          .getUserMedia({ audio: true, video: false })
          .then(function (mediaStreamObj) {
            const mediaRecorder = new MediaRecorder(mediaStreamObj);
            setMediaRecorder(mediaRecorder);
          })
          .catch(function (err) {
            toast.warning("دسترسی به میکروفون وجود ندارد");
          });
      } catch (e) {
        console.log(e);
        toast.warning("دسترسی به میکروفون وجود ندارد");
      }
    } else {
      recordAudioMsg();
    }
  };

  const recordAudioMsg = () => {
    let chunks: any[] = [];

    if (mediaRecorder.state === "inactive") {
      mediaRecorder.start();
      setRecording(true);
    } else {
      mediaRecorder.stop();
      setRecording(false);
    }

    mediaRecorder.ondataavailable = function (ev: any) {
      chunks.push(ev.data);
    };

    mediaRecorder.onstop = (ev: any) => {
      const blob = new Blob(chunks, { type: "audio/mpeg" });
      chunks = [];
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        onFileDelivered(
          reader.result as string,
          FileType.RecordedAudio,
          "mp3",
          blob.size
        );
      };
    };
  };

  const uploadingErrToaster = (msg: string) => {
    toast.error(msg);
    fileUploader.current!.value = "";
  };

  const onUploadingFileTriggered = () => {
    fileUploader.current!.click();
  };

  const onFileUploaded = async (e: any) => {
    const { files } = e.target;
    for (let i = 0; i < files.length; i++) {
      const fileExtension = files[i].name.split(".").pop().toLowerCase();

      let fileType: FileType;
      if (docFormats.includes(fileExtension)) fileType = FileType.Doc;
      else if (imageFormats.includes(fileExtension)) fileType = FileType.Image;
      else if (videoFormats.includes(fileExtension)) fileType = FileType.Video;
      else if (audioFormats.includes(fileExtension)) fileType = FileType.Audio;
      else {
        uploadingErrToaster(notSupported);
        return;
      }

      const isImg = fileType === FileType.Image;

      // compress image
      let minifiedImg;
      if (isImg) {
        if (files[i] === undefined) return;
        if (files[i].size / 1024 > 400)
          minifiedImg = await imagePicker(files[i]);
      }
      const finalFile =
        fileType === 1 ? (minifiedImg ? minifiedImg : files[i]) : files[i];

      if (fileType === 1 && finalFile.size > 1000) {
        var toKbyteFileSize = finalFile.size / 1024 / 1024;
      } else {
        var toKbyteFileSize = finalFile.size / 1024;
      }
      if (fileType === 1 && toKbyteFileSize > chatGlobalConfigs.picMaxSize) {
        uploadingErrToaster(picSizeExceeded);
        return;
      } else if (toKbyteFileSize > chatGlobalConfigs.fileMaxSize) {
        uploadingErrToaster(fileSizeExceeded);
        return;
      }

      //TODO: May FileReader become a func later!
      const reader = new FileReader();
      reader.readAsDataURL(
        isImg ? (minifiedImg ? minifiedImg : files[i]) : files[i]
      );
      reader.onloadend = async () => {
        onFileDelivered(
          reader.result as string,
          fileType,
          fileExtension,
          finalFile.size
        );

        fileUploader.current!.value = "";
      };
    }
  };

  const onEnterKeyDownTextSended = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.shiftKey && text) {
      insertMsgInvoker(text);
      setText("");
    }
  };

  const onBtnClickedTextSended = () => {
    if (!text) return;
    insertMsgInvoker(text);
    setText("");
  };

  return (
    <div className="chat-controls">
      <input
        hidden
        type="file"
        multiple
        accept={uploadAcceptedFormats}
        onChange={onFileUploaded}
        ref={fileUploader}
      />
      <ButtonBase
        className="chat-btn"
        onClick={onUploadingFileTriggered}
        {...{ disabled }}
        style={{ background: disabled ? "#ccc" : "#8e91f5" }}
      >
        <FontAwesomeIcon icon={faPaperclip} />
      </ButtonBase>
      {text !== "" ? (
        <ButtonBase className="chat-btn" onClick={onBtnClickedTextSended}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </ButtonBase>
      ) : (
        <ButtonBase
          className="chat-btn"
          {...{ disabled }}
          onClick={handleMicrophone}
        >
          <FontAwesomeIcon icon={!recording ? faMicrophone : faPause} />
        </ButtonBase>
      )}
      <textarea
        className="msg-input"
        onChange={(e) => {
          setText(e.target.value);
        }}
        value={text}
        onKeyPress={onEnterKeyDownTextSended}
        placeholder={
          recording ? "در حال ضبط صدا..." : "پیام خود را وارد کنید..."
        }
        style={{ background: disabled ? "#ccc" : "none" }}
        disabled={recording}
      />
    </div>
  );
}

export default ChatControls;
