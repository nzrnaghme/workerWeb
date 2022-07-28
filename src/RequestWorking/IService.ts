import { GlobalUrl, RequestRegistration, RequestWorking } from "../config";
import http from "../Services/httpService";
import { IFileUploaded } from "../Models/Entities";
import {
  IInsertReqWorkingSecurity,
  IUpdateReqWorking,
  IUpdateSecurity,
} from "./Entities";
import { IResult } from "../Services/Entities";

export const getRequisites = (
  reqConfirmId: string,
  userId: string
): Promise<IResult> => {
  http.setToken()
  return http.get(RequestWorking + "GetConfirm/" + reqConfirmId + "/" + userId);
};

export const postFileMsg = (data: IFileUploaded): Promise<IResult> => {
  http.setToken()
  return http.post(RequestWorking + "InsertRequestWorkingMessage", data);
};

export const updateRequestWorking = (
  data: IUpdateReqWorking
): Promise<IResult> => {
  http.setToken()
  return http.put(RequestWorking + "UpdateRequestWorking", data);
};

export const getAudienceUserInfo = (id: string): Promise<IResult> => {
  http.setToken()
  return http.get(GlobalUrl + "GetSummaryUserProfileInfo/" + id);
};

export const insertReqWorkingSecurity = (
  data: IInsertReqWorkingSecurity
): Promise<IResult> => {
  http.setToken()
  return http.post(RequestWorking + "InsertRequestWorkingSecurity", data);
};

export const updateReqWorkingSecurity = (
  data: IUpdateSecurity
): Promise<IResult> => {
  http.setToken()
  return http.put(RequestWorking + "UpdateRequestWorkingSecurity", data);
};

export const getReqRegistrationInfo = (reqId: string): Promise<IResult> => {
  http.setToken()
  return http.get(GlobalUrl + "GetRequestRegistrationInfo/" + reqId);
};

export const getRequestWorkingDuration = (reqWId: string): Promise<IResult> => {
  http.setToken()
  return http.get(RequestWorking + "GetRequestWorkingDuration/" + reqWId);
};

export const hasStartWorkingDate = (reqWId: string): Promise<IResult> => {
  http.setToken()
  return http.get(RequestWorking + "HasStartWorkingDate/" + reqWId);
};
