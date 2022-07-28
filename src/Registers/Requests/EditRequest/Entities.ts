import { PresenceTypeCategory, RequestType } from "../../../Models/Enums";
import { ILocation } from "../../../Components/Maps/Entities";
import { InsertRequestAttachment } from "../../../Models/Entities";

export interface IRegisterUpdate {
  requestRegistrationId: string;
  serviceCategoryId: string | null;
  presenceType: PresenceTypeCategory;
  region: string[] | null | undefined;
  location?: ILocation | null;
  fileList: InsertRequestAttachment[];
  content: string | null;
  title: string;
  beginDate: string | null;
  beginTime: string | null;
  locationName?: string | null;
  requestType: RequestType
}

export enum Priority {
  Normal,
  High,
}
