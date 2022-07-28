import {  RequestReportApi, GlobalUrl } from "../../config";
import { IResult } from "../../Services/Entities";
import http from "../../Services/httpService";
import { IFilterServisecRequests } from "../filters/Entites";


export function postAllUserRequest(data: IFilterServisecRequests): Promise<IResult> {
    http.setToken()
    return http.post(RequestReportApi + "GetRequestServantService", data);
}

export const getCategoryFiller = (): Promise<IResult> => {
    http.setToken()
    return http.get(GlobalUrl + 'GetServiceCategories')
}

export function getRequestRegisteration(userId: string): Promise<IResult> {
    http.setToken()
    return http.get(RequestReportApi + "GetRequestRegistration/" + userId);
}





