import { GlobalUrl, RequestRegistration, RequestWaiting, Survey } from "../config";
import { IResult } from "../Services/Entities";
import http from "../Services/httpService";
import { IReqScore } from "./Entities";

export const updateReqScore = (data: IReqScore): Promise<IResult> => {
  http.setToken()
  return http.put(Survey + "UpdateRequestScore", data);
};

export const getConfirm = (reqConfirmId: string): Promise<IResult> => {
  http.setToken()
  return http.get(Survey + "GetConfirm/" + reqConfirmId);
};

//avatar and name
export const getSummaryUserProfileInfo = (userId: string): Promise<IResult> => {
  http.setToken()
  return http.get(GlobalUrl + "GetSummaryUserProfileInfo/" + userId);
};

//details
export const getReqRegistrationInfo = (reqId: string): Promise<IResult> => {
  http.setToken()
  return http.get(GlobalUrl + "GetRequestRegistrationInfo/" + reqId);
};
