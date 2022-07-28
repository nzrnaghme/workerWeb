import { Gender, Disability, FileType, MsgsState } from "./Enums";

export interface IChatGlobalConfigs {
  picMaxSize: number;
  fileMaxSize: number;
}

export interface ILocation {
  latitude: number;
  longitude: number;
  name: string;
  date: string;
}

export interface IUserInfo {
  firstName: string;
  lastName: string;
  gender: Gender;
  disability: Disability;
  picture: string;
  score: number;
  like: number;
  dislike: number;
  cancellation: number;
  delay: number;
}

export interface IPhoneNumberSave {
  mobileNo: string;
}

export interface ILoginSave {
  mobileNo: string;
  code: number;
}

export interface IFileMessage {
  name?: string | null;
  fileExtension: string;
  fileSize?: number | null;
  fileType: FileType | null;
  content?: string | null;
}

export interface IFileAttachment extends IFileMessage {
  id: string;
}

export interface IMessage {
  id: string;
  message: string;
  fileMessage: IFileMessage;
  isMine: boolean;
  sendDate: string;
  isReceived?: boolean;
  date?: string;
}

export interface IMsgsByState {
  state: MsgsState;
  messages: IMessage[] | [];
}

export interface IMsgListened {
  id: string;
  message: string;
  fileMessage: IFileMessage;
  sendDate: string;
  isRecieved: boolean;
  isMine: boolean;
  requestId: string;
  date?: string;
}

export interface IMsgSended {
  date?: string;
  id: string;
  requestId: string;
  senderUserId: string;
  receiverUserId: string;
  sendDate: string | null;
  message: string;
  fileMessage: IFileMessage | null;
}

export interface IFileUploaded {
  requestId: string;
  senderUserId: string;
  receiverUserId: string;
  message: string; //To be deleted later!
  sendDate: string | null;
  fileType: FileType;
  fileExtension: string;
  file: string;
  fileSize: number;
}

export interface IRequestConfirm {
  requestRegistrationId: string;
  servantUserId: string;
  requestUserId: string;
}

export interface IInsertRequestConfirm {
  requestRegistrationId: string;
  servantUserId: string;
}

export const audioFormats = ["mp3", "wma", "m4a"];
export const imageFormats = ["jpeg", "png", "gif", "jpg", "bmp"];
export const videoFormats = ["mkv", "mp4", "3gp"];
export const docFormats = ["doc", "docx", "xls", "xlsx", "rtf", "txt", "pdf"];

export interface InsertRequestAttachment {
  content: string;
  extension: string;
  fileType: FileType;
  fileSize: number;
}

export interface DetailLocation {
  name: string;
  latitude: DoubleRange;
  longitude: DoubleRange;
}

export interface DetailAttachFile {
  fileType: FileType;
  id: string;
  fileExtension: string;
}

export interface IPayBank {
  userId: string;
  callback_url: string,
  amount: number;
  description: string;
}

