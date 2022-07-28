import React, { useEffect, useRef, useState } from "react";
import ButtonBase from "@material-ui/core/ButtonBase";
import { IFileAttachment } from "../Models/Entities";
import { fileIconSupplier } from "./hooks/fileHelper";
import { FileType } from "../Models/Enums";

type Props = {
  attachments: IFileAttachment[] | [];
  getFileAttachment: (fileId: string) => any;
};

function Attachments({ attachments, getFileAttachment }: Props) {
  const [base64File, setBase64File] = useState<string[]>([]);
  const fileDownloader = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    for (let i = 0; i < attachments.length; i++) {
      attachments[i].name = (i + 1).toString();
    }
  }, []);

  useEffect(() => {
    if (base64File.length === 0) return;
    fileDownloader.current!.click();
    setBase64File([]);
  }, [base64File]);

  const onDownloadingByFileId = async (file: IFileAttachment) => {
    const res = await getFileAttachment(file.id);
    if (res.Error !== null) return;
    let extension = file.fileExtension;
    setBase64File([res.Data, file.name, extension]);
  };

  const fileAttachmentsMapper = () => {
    return attachments.map((attachment) => {
      return (
        <>
          <span style={{ margin: "0.25rem" }}>
            <ButtonBase
              onClick={() => onDownloadingByFileId(attachment)}
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <img
                src={
                  (attachment.fileType === FileType.Image
                    ? attachment.content
                    : fileIconSupplier(attachment.fileType!)) as
                    | string
                    | undefined
                }
                style={{ height: "100%" }}
                alt="fileIcon"
              />
            </ButtonBase>
          </span>
          <a
            hidden
            href={base64File[0]}
            download={base64File[1] + "." + base64File[2]}
            ref={fileDownloader}
          />
        </>
      );
    });
  };

  return <>{fileAttachmentsMapper()}</>;
}

export default Attachments;
