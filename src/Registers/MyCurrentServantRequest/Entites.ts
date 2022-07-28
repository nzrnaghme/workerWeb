import { ConfirmStatus, PresenceTypeCategory, ReportRequestStatus, RequestType, RequestStepServant } from "../../Models/Enums";


export interface CurrentList {
    requestRegistrationId:string,
    requestConfirmId: string,
    title: string,
    stepId: string,
    requestStep: RequestStepServant,
    requestType: RequestType,
    reportRequestStatus: ReportRequestStatus,
    content:string,
    presenceType: PresenceTypeCategory,
    firsName:string,
    lastName:string,
    beginDate:string,
    beginTime:string,
    servantUserId:string
}

export interface IFilter {
    skip: number,
    take: number,
    servantUserId?: string
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

export interface CurrentServant{
    requestConfirmId:string,
    servantUserId:string
}