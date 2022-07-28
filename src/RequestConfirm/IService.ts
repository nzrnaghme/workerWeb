import { GlobalUrl, RequestConfirm, RequestRegistration } from "../config";
import http from "../Services/httpService";
import { IFileUploaded, IInsertRequestConfirm, IPayBank } from "../Models/Entities";
import { IReqLocationInfo, IPay, IInitialize } from "./Entities";
import { IResult } from "../Services/Entities";

export const getInitialize = (data: IInitialize): Promise<IResult> => {
  http.setToken()
  return http.post(RequestConfirm + "GetInitialize", data);
};

export const getReqRegistrationInfo = (reqId: string): Promise<IResult> => {
  http.setToken()
  return http.get(GlobalUrl + "GetRequestRegistrationInfo/" + reqId);
};

export const getConfig = (): Promise<IResult> => {
  http.setToken()
  return http.get(GlobalUrl + "GetConfig" );
};

export const getProfileSummaryInfo = (id: string): Promise<IResult> => {
  http.setToken()
  return http.get(GlobalUrl + "GetSummaryUserProfileInfo/" + id);
};

export function getCheckProfile(userId: string): Promise<IResult> {
  http.setToken()
  return http.get(GlobalUrl + "HasProfileImage/" + userId);
}

export const isInvalidOperation = (reqId: string): Promise<IResult> => {
  http.setToken()
  return http.get(RequestConfirm + "IsInvalidOperation/" + reqId);
};

export function getRequestLocationInfo(
  reqRegistrationId: string
): Promise<IResult> {
  http.setToken()
  return http.get(
    GlobalUrl + "GetRequestLocationInfo/" + reqRegistrationId
  );
}

export function updateRequestLocationInfo(
  data: IReqLocationInfo
): Promise<IResult> {
  http.setToken()
  return http.post(GlobalUrl + "UpdateRequestLocationInfo", data);
}

export const hasRequestRegistrationLocation = (
  reqRegistrationId: string
): Promise<IResult> => {
  http.setToken()
  return http.get(
    RequestConfirm + "HasRequestRegistrationLocation/" + reqRegistrationId
  );
};

export const getRequestBeginDateTime = (
  reqRegistrationId: string
): Promise<IResult> => {
  http.setToken()
  return http.get(
    RequestConfirm + "GetRequestBeginDateTime/" + reqRegistrationId
  );
};

export const postFileMsg = (data: IFileUploaded): Promise<IResult> => {
  http.setToken()
  return http.post(RequestConfirm + "InsertRequestConfirmMessage", data);
};

export const getRequestAttachments = (
  reqRegistrationId: string
): Promise<IResult> => {
  http.setToken()
  return http.get(RequestConfirm + "GetRequestAttachment/" + reqRegistrationId);
};

export const getRequestAttachmentById = (fileId: string): Promise<IResult> => {
  http.setToken()
  return http.get(RequestConfirm + "GetRequestAttachmentById/" + fileId);
};

export const getAmount = (userId: string): Promise<IResult> => {
  http.setToken()
  return http.get(GlobalUrl + "GetAmount/" + userId);
};

export const pay = (data: IPay, isPaySuccessFul: boolean): Promise<IResult> => {
  http.setToken()
  return http.post(GlobalUrl + "Pay/" + isPaySuccessFul, data);
};

export const insertRequestConfirm = (
  data: IInsertRequestConfirm
): Promise<IResult> => {
  http.setToken()
  return http.post(RequestConfirm + "InsertRequestConfirm", data);
};

export const postGetAuthorityForPayment = (data: IPayBank): Promise<IResult> => {
  http.setToken()
  return http.post(RequestConfirm + "GetAuthorityForPayment", data);
};
