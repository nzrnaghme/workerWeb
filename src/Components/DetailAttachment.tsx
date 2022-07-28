import React, { useEffect, useRef, useState } from "react";
import ButtonBase from "@material-ui/core/ButtonBase";
import { IFileAttachment } from "../Models/Entities";
import { fileIconSupplier } from "./hooks/fileHelper";
import { FileType } from "../Models/Enums";

type Props = {
  attachments: IFileAttachment[] | [];
  getFileAttachment: (fileId: string) => any;
};

function DetailAttachment({ attachments, getFileAttachment }: Props) {
  const [base64File, setBase64File] = useState<string[]>([]);
  const fileDownloader = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (base64File.length === 0) return;
    fileDownloader.current!.click();
    setBase64File([]);
  }, [base64File]);

  const onDownloadingByFileId = async (file: any) => {
    setBase64File([file.content, file.name, file.fileExtension]);
  };

  const fileAttachmentsMapper = () => {
    let fileIdName = 1;
    return attachments.map((attachment) => {
      attachment.name = (fileIdName++).toString();
      return (
        <span style={{ margin: "0.5rem" }}>
          <ButtonBase
            onClick={() => {
              onDownloadingByFileId(attachment);
            }}
            style={{ width: "2rem" }}
          >
            <img
              src={
                attachment.fileType === FileType.Image
                  ? attachment.content
                  : fileIconSupplier(attachment.fileType!)
              }
              style={{ width: "100%" }}
              alt="fileIcon"
            />
          </ButtonBase>
          <a
            hidden
            href={base64File[0]}
            download={base64File[1] + "." + base64File[2]}
            ref={fileDownloader}
          >
            {" "}
          </a>
        </span>
      );
    });
  };

  return <>{fileAttachmentsMapper()}</>;
}

export default DetailAttachment;
