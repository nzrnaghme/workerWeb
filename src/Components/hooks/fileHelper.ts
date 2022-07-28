import audioIcon from "../../Images/audio.png";
import imageIcon from "../../Images/image.png";
import videoIcon from "../../Images/video.png";
import docIcon from "../../Images/doc.png";
import { FileType } from "../../Models/Enums";

export const fileIconSupplier = (fileType: FileType) => {
  switch (fileType) {
    case FileType.Doc:
      return docIcon;
    case FileType.Audio:
      return audioIcon;
    case FileType.Video:
      return videoIcon;
    case FileType.Image:
      return imageIcon;
  }
};

export const getVersion = (callBack: (data: any) => void) => {
  fetch(`${process.env.PUBLIC_URL}/config.json`)
    .then((r) => r.json())
    .then((data) => {
      callBack(data);
      return data;
    })
    .catch((data) => {
      callBack(null);
    });
};
