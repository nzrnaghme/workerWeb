import { Gender, PresenceTypeCategory, RequestType } from "../../Models/Enums"

export interface ISearchRequest {
    textFilter: string | null,
    rootFilter: number | null,
    stateId: string | null,
    userId: string | null
}

export interface IRequestInSearch {
    requestRegistrationId: string,
    presenceType: PresenceTypeCategory,
    title: string,
    locationName: string | null,
    beginTime: string | null,
    beginDate: string | null,
    content: string | null,
    userId: string,
    clientScore: number,
    gender: Gender,
    region: string[] | null,
    requestType: RequestType
}