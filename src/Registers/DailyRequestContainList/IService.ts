import { GlobalUrl, RequestListApi } from "../../config";
import { IResult } from "../../Services/Entities";
import http from "../../Services/httpService";
import { IFilterDaily } from "../filters/Entites";
import { InsertData, InsertWallet } from "./Entities";

export function postRequestFilter(data: IFilterDaily): Promise<IResult> {
    http.setToken()
    return http.post(RequestListApi + "GetPresentableRequestByFilter", data);
}

export const getCategoryFiller = (): Promise<IResult> => {
    http.setToken()
    return http.get(GlobalUrl + 'GetServiceCategories')
}

export function getCheckWallet(userId: string): Promise<IResult> {
    http.setToken()
    return http.get(RequestListApi + "GetWalletWithdrawalAmount/" + userId);
}

export function getCheckProfile(userId: string): Promise<IResult> {
    http.setToken()
    return http.get(GlobalUrl + "HasProfileImage/" + userId);
}

export function getCheckRegister(ServantUserId: string, RequestRegistrationId: string): Promise<IResult> {
    http.setToken()
    return http.get(RequestListApi + "GetHasAllowedRequest/" + ServantUserId + "/" + RequestRegistrationId);
}

export function getCheckAcceptRequest(ServantUserId: string): Promise<IResult> {
    http.setToken()
    return http.get(RequestListApi + "GetCountAcceptedRequest/" + ServantUserId);
}

export function getBallance(userId: string): Promise<IResult> {
    http.setToken()
    return http.get(GlobalUrl + "GetWalletBalance/" + userId);
}


export function getConfig(): Promise<IResult> {
    http.setToken()
    return http.get(GlobalUrl + "GetConfig");
}

export function postInsertRequest(data: InsertData): Promise<IResult> {
    http.setToken()
    return http.post(RequestListApi + "InsertRequestConfirm", data);
}

export const viewUpdate = (data: string): Promise<IResult> => {
    http.setToken()
    return http.put(RequestListApi + "UpdateRequestRegistrationViewCount/" + data)
}

export function postPay(data: InsertWallet): Promise<IResult> {
    http.setToken()
    return http.post(GlobalUrl + "pay", data);
}

export function getCategoryIdByUser(id: string): Promise<IResult> {
    http.setToken()
    return http.get(RequestListApi + "GetUserServiceCategory/" + id);
}

export function getAcceptedRequest(ServantUserId: string, RequestRegistrationId: string): Promise<IResult> {
    http.setToken()
    return http.get(RequestListApi + "GetHasAcceptedRequest/" + ServantUserId + "/" + RequestRegistrationId);
}



