import { GlobalUrl, RequestReportApi } from "../../config";
import { IResult } from "../../Services/Entities";
import http from "../../Services/httpService";
import { IFilterServisecRequests } from "../filters/Entites";
import { IServant } from "./Entities";

export function postAllUserRequest(userId: IFilterServisecRequests): Promise<IResult> {
  http.setToken()
  return http.post(RequestReportApi + "GetUserRequestRegistration", userId);
}

export const getCategoryFiller = (): Promise<IResult> => {
  http.setToken()
  return http.get(GlobalUrl + "GetServiceCategories");
};

export function getShowRequestConfirm(userId: IServant): Promise<IResult> {
  http.setToken()
  return http.post(RequestReportApi + "GetRequestConfirm", userId);
}

export function getRequestRegisteration(
  requestRegisterationId: string
): Promise<IResult> {
  http.setToken()
  return http.get(
    RequestReportApi +
      "GetRequestRegistrationForDetail/" +
      requestRegisterationId
  );
}

export function getFileMsg(requestAttachmentId: string): Promise<IResult> {
  http.setToken()
  return http.get(
    RequestReportApi + "GetRequestAttachmentById/" + requestAttachmentId
  );
}

export function getCountAcceptRequestConfirm(
  requestRegistrationId: string
): Promise<IResult> {
  http.setToken()
  return http.get(
    GlobalUrl + "GetCountAcceptedRequestConfirm/" + requestRegistrationId
  );
}

export function getCancelRequestReqisterBeforConfirm(
  requestRegistrationId: string,
  userId: string
): Promise<IResult> {
  http.setToken()
  return http.get(
    RequestReportApi +
      "CancelRequestRegistrationBeforeConfirm/" +
      requestRegistrationId +
      "/" +
      userId
  );
}
