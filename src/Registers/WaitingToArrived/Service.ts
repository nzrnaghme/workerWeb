import http from "../../Services/httpService";
import { RequestWaiting, RequestRegistration, GlobalUrl } from "../../config";
import { IFileUploaded } from "../../Models/Entities";
import {
  IRequestWaiting,
  IRenewRequestWaiting,
  IArrived,
  IRefuseArrive,
  IWorkDate,
  IUpdateLocation,
} from "./Entities";
import { IResult } from "../../Services/Entities";

//globals
export const getConfigs = (): Promise<IResult> => {
  http.setToken()
  return http.get(GlobalUrl + "GetConfig");
};

export const getReqRegistrationInfo = (reqId: string): Promise<IResult> => {
  http.setToken()
  return http.get(GlobalUrl + "GetRequestRegistrationInfo/" + reqId);
};

//avatar and name
export const getSummaryUserProfileInfo = (userId: string): Promise<IResult> => {
  http.setToken()
  return http.get(GlobalUrl + "GetSummaryUserProfileInfo/" + userId);
};

export const hasRequestRegistrationLocation = (
  requestRegistrationId: string
): Promise<IResult> => {
  http.setToken()
  return http.get(
    RequestWaiting + "HasRequestRegistrationLocation/" + requestRegistrationId
  );
};

//TODO: delete
export const getRequestConfirm = (
  requestConfirmId: string
): Promise<IResult> => {
  http.setToken()
  return http.get(GlobalUrl + "GetRequestConfirm/" + requestConfirmId);
};

//location
export const getRequestLocationInfo = (
  requestRegistrationId: string
): Promise<IResult> => {
  http.setToken()
  return http.get(
    GlobalUrl + "GetRequestLocationInfo/" + requestRegistrationId
  );
};

export const insertRequestWaiting = (
  data: IRequestWaiting
): Promise<IResult> => {
  http.setToken()
  return http.post(RequestWaiting + "InsertRequestWaiting", data);
};

//
export function hasMoveRequestWaiting(
  requestRegistrationId: string
): Promise<IResult> {
  http.setToken()
  return http.get(
    RequestWaiting + "HasMoveRequestWaiting/" + requestRegistrationId
  );
}

//renew
export const renewRequestWaiting = (
  data: IRenewRequestWaiting
): Promise<IResult> => {
  http.setToken()
  return http.post(RequestWaiting + "RenewRequestWaiting", data);
};

//chat
export const postFileMsg = (data: IFileUploaded): Promise<IResult> => {
  http.setToken()
  return http.post(RequestWaiting + "InsertRequestWaitingMessage", data);
};

//arrived
export const arrivedConfirmRequestWaiting = (
  data: IArrived
): Promise<IResult> => {
  http.setToken()
  return http.post(RequestWaiting + "ArrivedConfirmRequestWaiting", data);
};

//arrivedRefuse
export const arrivedRefuseRequestWaiting = (
  data: IRefuseArrive
): Promise<IResult> => {
  http.setToken()
  return http.post(RequestWaiting + "ArrivedRefuseRequestWaiting", data);
};

//workDate
export const getRequestEstimatedWorkDate = (
  data: IWorkDate
): Promise<IResult> => {
  http.setToken()
  return http.post(RequestWaiting + "GetRequestEstimatedWorkDate", data);
};

//update location
export const updateRequestLocationInfo = (
  data: IUpdateLocation
): Promise<IResult> => {
  http.setToken()
  return http.post(GlobalUrl + "UpdateRequestLocationInfo", data);
};

export const getInitialize = (
  requestConfirmId: string,
  userId: string
): Promise<IResult> => {
  http.setToken()
  return http.get(
    RequestWaiting + "GetInitialize/" + requestConfirmId + "/" + userId
  );
};
