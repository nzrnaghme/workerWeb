import { RequestReportApi } from "../../config";
import { IResult } from "../../Services/Entities";
import http from "../../Services/httpService";
import {  IFilter } from "./Entites";


export const postCurrentRequestList = (filter: IFilter): Promise<IResult> => {
    http.setToken()
    return http.post(RequestReportApi + 'GetUserCurrentRequestRegistrations' , filter)
}

export const getCurrentStep = (requestConfirmId: string, userId: string): Promise<IResult> => {
    http.setToken()
    return http.get(RequestReportApi + 'GetRequestUserCurrentStep/' + requestConfirmId + "/" + userId )
}
