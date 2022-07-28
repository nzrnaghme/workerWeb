import { GlobalUrl, RequestReportApi } from "../../../config";
import { IResult } from "../../../Services/Entities";
import http from "../../../Services/httpService";
import { IRegisterUpdate } from "../EditRequest/Entities";

//elemental Values
export function getRequestRegistrationForEdit(
  requestId: string
): Promise<IResult> {
  http.setToken()
  return http.get(
    RequestReportApi + "GetRequestRegistrationForEdit/" + requestId
  );
}

//fill category
export function getCategories(): Promise<IResult> {
  http.setToken()
  return http.get(GlobalUrl + "GetServiceCategories");
}

// config
export function getConfigs(): Promise<IResult> {
  http.setToken()
  return http.get(GlobalUrl + "GetConfig");
}

//profile image
export function hasProfileImage(userId: string): Promise<IResult> {
  http.setToken()
  return http.get(GlobalUrl + "HasProfileImage/" + userId);
}

//update request
export function updateRequestRegistration(
  item: IRegisterUpdate
): Promise<IResult> {
  http.setToken()
  return http.put(RequestReportApi + "UpdateRequestRegistration", item);
}

export function getCountAcceptRequestConfirm(
  requestRegistrationId: string
): Promise<IResult> {
  http.setToken()
  return http.get(
    GlobalUrl + "GetCountAcceptedRequestConfirm/" + requestRegistrationId
  );
}
