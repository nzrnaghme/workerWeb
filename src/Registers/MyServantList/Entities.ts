
import {
    RequestType,
    RequestStatus,
    PresenceTypeCategory,
    ConfirmStatus,
    Priority,
    ReportRequestStatus,
} from "../../Models/Enums";
import { InsertRequestAttachment } from "../../Models/Entities"


export interface MyServantData {
    id: string;
    servantUserId: string;
    requestUserId: string;
    title: string;
    acceptanceDate: string,
    canceledDate: string,
    canceledUserId: string,
    confirmWorkDate: string,
    canceledStep: RequestStatus,
    requestRegistrationId: string,
    content: string,
    requestType: RequestType,
    presenceType: PresenceTypeCategory,
    locationName: string,
    status: ReportRequestStatus,
    requestDate: string,
    firstName: string,
    lastName: string,
    canceledUserName?: string;
}

export interface IFilterServant {
    skip: number;
    take: number;
    userId?: string;
    requestType?: Number[] | null;
    regions: string[] | null;
    endDate: string | null;
    beginDate: string | null;
    presenceType?: Number[] | null;
    requestCategoryId?: string[] | null;
    reportRequestStatus?: string[] | null;
}

export interface RequestServant {
    requestFirstName: string,
    requestLastName: string,
    servantFirstName: string,
    servantLastName: string,
    canceledFirstName: string,
    canceledLastName: string,
    acceptanceDate: Date,
    confirmedDate: Date,
    confirmStatus: ConfirmStatus,
    canceledDate: Date,
    requestFullName: string,
    servantFullName: string
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
    attachments?: InsertRequestAttachment[];
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
    latitude: number | undefined,
    longitude: number | undefined,
    date: string | undefined,
    name: string | undefined
}






