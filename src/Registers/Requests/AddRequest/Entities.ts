import { ILocation } from "../../../Components/Maps/Entities";
import { InsertRequestAttachment } from "../../../Models/Entities";
import { RequestType, PresenceTypeCategory } from "../../../Models/Enums";

export interface IRegisterSave {
  requestType: RequestType;
  requestCategoryId?: string | null;
  expiration: number;
  presenceType: PresenceTypeCategory;
  stateId?: string | null;
  cityId?: string | null;
  regionId?: string | null;
  location?: ILocation | null;
  fileList: InsertRequestAttachment[];
  userId: string;
  content: string | null;
  beginDate: string | null;
  beginTime: string | null;
  priority: Priority;
  title: string;
  locationName?: string | null;
}
export interface IValidationSave {
  userId: string;
  requestType: RequestType;
  expiration: number;
}

export interface IPay {
  userId: string;
  amount: number;
  isPaySuccessFul: boolean;
}

export interface IAmount {
  requestType: RequestType;
  expiration: number;
}

export enum Priority {
  Normal,
  High,
}

export interface ICity {
  id: string;
  name: string;
  type: Type;
  parentId?: string;
}

export enum Type {
  State,
  City,
  Region,
}

export enum ProfileImageAndState {
  HasNotImage,
  HasNotState,
  HasNotImageAndState,
  HasImageAndState,
}
