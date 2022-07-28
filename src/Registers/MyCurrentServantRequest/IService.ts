import { RequestReportApi } from "../../config";
import { IResult } from "../../Services/Entities";
import http from "../../Services/httpService";
import { IFilter } from "./Entites";


export const postCurrentServantList = (filter: IFilter): Promise<IResult> => {
    http.setToken()
    return http.post(RequestReportApi + 'GetUserCurrentService' , filter)
}

export const getCurrentStep = (servantUserId: string, requestConfirmId: string): Promise<IResult> => {
    http.setToken()
    return http.get(RequestReportApi + 'GetServantUserCurrentStep/' + servantUserId + '/' + requestConfirmId )
}

