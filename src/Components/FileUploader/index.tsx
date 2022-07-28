import { useState, useRef, useEffect } from "react";
import { faPlus, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.scss";
import { toast } from "react-toastify";
import { toPersianNumber } from "../hooks/persianHelper";
import { FileType } from "../../Models/Enums";
import doc from "../../Images/doc.png";
import audio from "../../Images/audio.png";
import video from "../../Images/video.png";
import imagePicker from "./imagePicker";

const audioFormats = ["mp3", "wma", "m4a"];
const imageFormats = ["jpeg", "png", "gif", "jpg", "bmp"];
const videoFormats = ["mkv", "mp4", "3gp"];
const docFormats = ["doc", "docx", "xls", "xlsx", "rtf", "txt", "pdf"];

export interface IEditFile {
  name: string;
  id: number;
  file: string;
  uploadedFile?: File;
  numberName: number;
}

type props = {
  fileCount: number;
  fileSize: number;
  onFileChanged: (fileList: IEditFile[]) => void;
  label?: string;
  editFiles?: IEditFile[];
};
const FileUploader = ({
  fileCount,
  fileSize,
  onFileChanged,
  label,
  editFiles,
}: props) => {
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [sizeAllFiles, setSizeAllFiles] = useState(0);
  const [allFilesObj, setAllFilesObj] = useState<IEditFile[]>([]);
  const [base64File, setBase64File] = useState<string[]>([]);
  const fileDownloader = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (editFiles != undefined) setAllFilesObj(editFiles);
  }, [editFiles]);

  useEffect(() => {
    onFileChanged(allFilesObj);
  }, [allFilesObj]);

  useEffect(() => {
    if (base64File.length === 0) return;
    fileDownloader.current!.click();
    setBase64File([]);
  }, [base64File]);

  const onUploadingFile = (e: any) => {
    const { files } = e.target;
    insertFilesinBox(files, true);
  };

  const insertFilesinBox = async (files: any, showError: boolean) => {
    if (files.length === 0) return;

    // for (let i = 0; i < files.length; i++) {
    //   let file = files[i].name;
    //   let hasConflict = allFilesObj.filter((c) => c.name === file).length;
    //   if (hasConflict) {
    //     if (showError) toast.error(`فایل با اسم ${file} وجود دارد`);
    //     return;
    //   }
    // }

    if (allFilesObj.length + files.length > fileCount) {
      toast.error(
        `تعداد فایل نباید بیشتر از ${toPersianNumber(fileCount)} باشد`
      );
      return;
    }

    let allSize = sizeAllFiles;
    let newtAllFilesObj = [];

    for (let i = 0; i < files.length; i++) {
      // Criterion

      const fileExtension = files[i].name!.split(".").pop().toLowerCase();
      let fileType: FileType;
      if (docFormats.includes(fileExtension)) {
        fileType = FileType.Doc;
      } else if (imageFormats.includes(fileExtension)) {
        fileType = FileType.Image;
      } else if (videoFormats.includes(fileExtension)) {
        fileType = FileType.Video;
      } else if (audioFormats.includes(fileExtension)) {
        fileType = FileType.Audio;
      } else {
        toast.error("فرمت پشتیبانی نمیشود");
        return;
      }

      let ids: any = [...allFilesObj, ...newtAllFilesObj].map(
        (c) => c.numberName
      );
      var max = ids.length > 0 ? Math.max.apply(Math, ids) + 1 : 1;
      // compress image

      let blob;
      if (fileType === FileType.Image) {
        if (files[i] === undefined) return;
        if (files[i].size / 1024 > 400) blob = await imagePicker(files[i]);
      }

      const newFile =
        fileType === FileType.Image ? (blob ? blob : files[i]) : files[i];
      let x = allSize + newFile.size / 1024;
      if (x > fileSize) {
        toast.error(
          `حجم کل فایل ها نباید بیشتر از ${toPersianNumber(
            fileSize
          )} کیلوبایت باشد`
        );
        return;
      } else {
        allSize = x;
      }

      newtAllFilesObj.push({
        name: files[i].name,
        id: Math.random() * 1e10,
        uploadedFile:
          fileType === FileType.Image ? (blob ? blob : files[i]) : files[i],
        numberName: max++,
      });
    }

    setSizeAllFiles(allSize);

    setAllFilesObj([...allFilesObj, ...newtAllFilesObj]);
  };

  const handleFileChosen = async (file: IEditFile) => {
    const t = new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.readAsDataURL(file.uploadedFile!);
      fileReader.onload = () => {
        resolve(fileReader.result);
        let extension = file.name.split(".")[1];
        setBase64File([fileReader.result!.toString(), file.name, extension]);
      };
      fileReader.onerror = reject;
    });
    return t;
  };

  const downloadImageHandler = async (file: IEditFile) => {
    let extension = file.name.split(".")[1];
    // image from server
    if (file.file !== undefined)
      setBase64File([file.file, file.name, extension]);
    else {
      // it was just updated
      //makeBase64
      const base64 = await handleFileChosen(file);
    }
  };

  const showIcon = (file: IEditFile, blob: Blob | string) => {
    let src = (blob as Blob).type
      ? URL.createObjectURL(blob as Blob)
      : (blob as string);

    return (
      <div className="file-img-wrapper">
        <img
          src={src}
          onClick={() => {
            downloadImageHandler(file);
          }}
          alt=""
        />
        <span className="file-img-name">{file.numberName}</span>
        {/* <sub style={{ marginTop: "32px" }}>{file.numberName}</sub> */}
        <span
          className="file-img-delete"
          onClick={(s) => {
            handleFileDeleted(file);
          }}
        >
          <FontAwesomeIcon icon={faMinusCircle} />
        </span>
      </div>
    );
  };

  const showFileIcon = (file: IEditFile, i: any) => {
    let p =
      file != undefined && file?.name != undefined
        ? file!.name.split(".").pop()
        : "";

    if (p != undefined) p = p.toLowerCase();

    switch (p) {
      case "doc":
      case "docx":
      case "xls":
      case "xlsx":
      case "rtf":
      case "txt":
      case "pdf":
        return showIcon(file, doc);
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "bmp":
        return showIcon(
          file,
          file.uploadedFile != undefined ? file.uploadedFile : file.file
        );
      case "wma":
      case "m4a":
      case "mp3":
        return showIcon(file, audio);
      case "mp4":
      case "3gp":
      case "mkv":
        return showIcon(file, video);
    }
  };

  const handleFileDeleted = (file: any) => {
    let newFiles = allFilesObj.filter((c) => c.id != file.id);
    uploadInputRef.current!.value = "";
    setAllFilesObj(newFiles);
    if (file.file !== undefined)
      setSizeAllFiles((prev) => prev - file.file.size / 1024);
    else setSizeAllFiles((prev) => prev - file.uploadedFile.size / 1024);
  };

  const onUploadBtnclicked = () => {
    uploadInputRef.current!.click();
  };

  return (
    <div className="file-uploader-wrapper">
      <label className="file-uploader-label">{label}</label>
      <span className="file-uploader-add-btn" onClick={onUploadBtnclicked}>
        <FontAwesomeIcon icon={faPlus} />
      </span>
      <input
        multiple
        hidden
        type="file"
        ref={uploadInputRef}
        onChange={onUploadingFile}
      />
      <div className="uploaded-files-wrapper">
        {allFilesObj && allFilesObj.map(showFileIcon)}
      </div>
      <a
        hidden
        href={base64File[0]}
        download={base64File[1] + "." + base64File[2]}
        ref={fileDownloader}
      >
        {" "}
      </a>
    </div>
  );
};
export default FileUploader;

export interface InsertRequestAttachment {
  content: string;
  extension: string;
  fileType: FileType;
}
