
import { IFileAttachment } from "../../Models/Entities";
import {
    RequestType,
    PresenceTypeCategory,
    Priority,
    FileType,
    RequestStatus,
    ReportRequestStatus
} from "../../Models/Enums";


export interface MyRequestData {
    id: string;
    userId: string;
    content: string;
    title: string;
    requestType: RequestType;
    requestCategoryId?: string;
    isExpired: boolean;
    presenceType: PresenceTypeCategory;
    locationName: string;
    requestStatus: RequestStatus;
    requestDate: Date;
    viewCount: number;
    rejectReason: string | null
}

export interface IFilter {
    skip: number;
    take: number;
    userId?: string;
    requestType?: Number[] | null;
    regions: string[] | null;
    endDate: string | null;
    beginDate: string | null;
    presenceType?: Number[] | null;
    requestCategoryId?: string[] | null;
    requestStatus?: string[] | null;
}

export interface RequestServant {
    id: string,
    requestFirstName: string,
    requestLastName: string,
    servantFirstName: string,
    servantLastName: string,
    canceledUserName: string,
    acceptanceDate: string,
    confirmedDate: string,
    status: ReportRequestStatus,
    canceledDate: string,
    requestFullName: string,
    servantFullName: string,
}

export interface IServant {
    take: number,
    skip: number,
    requestRegistrationId: string
}

export interface IRegisterSave {
    requestType: RequestType;
    requestCategoryId: string;
    expiration: number;
    presenceType: PresenceTypeCategory;
    stateId: string;
    categoryName: string;
    cityId: string;
    regionId: string;
    location: ILocation;
    attachments: IFileAttachment[] | [];
    userId: string;
    content: string;
    beginDate: string | null;
    beginTime: string;
    priority: Priority;
    title: string;
    locationName: string;
    showMobileNo: boolean;
    stateName: string;
    cityName: string;
    regionName: string;
    requestDate: string;
    expirationDate: string;
}

export interface ILocation {
    latitude: number,
    longitude: number,
    date: string,
    name: string
}


