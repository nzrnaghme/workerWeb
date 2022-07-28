import { ConfirmStatus, PresenceTypeCategory, RequestStep, RequestType, RequestStepServant, ReportRequestStatus } from "../../Models/Enums";


export interface CurrentList {
    requestRegistrationId:string,
    requestConfirmId: string,
    title: string,
    requestType: RequestType,
    requestDate: string,
    locationName?: string,
    presenceType: PresenceTypeCategory,
    servantFirsName: string,
    servantLastName: string,
    beginDate: string,
    beginTime: string,
    requestStep: RequestStepServant,
    reportRequestStatus: ReportRequestStatus,
    stepId: string,
    viewCount:number
}

export interface IFilter {
    skip: number,
    take: number,
    userId?: string
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
