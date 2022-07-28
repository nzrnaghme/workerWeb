import { GlobalUrl, RequestRegistration } from "../../../config";
import { IPayBank } from "../../../Models/Entities";
import { IResult } from "../../../Services/Entities";
import http from "../../../Services/httpService";
import { IRegisterSave, IValidationSave, IAmount, IPay } from "./Entities";

//profile image
export function hasProfileImage(userId: string): Promise<IResult> {
  http.setToken()
  return http.get(GlobalUrl + "HasProfileImage/" + userId);
}

export function getWalletBalance(userId: string): Promise<IResult> {
  http.setToken()
  return http.get(RequestRegistration + "GetWalletBalance/" + userId);
}


export function hasUserState(userId: string): Promise<IResult> {
  http.setToken()
  return http.get(GlobalUrl + "HasUserState/" + userId);
}

export function getAmountForRequest(data: IAmount): Promise<IResult> {
  http.setToken()
  return http.get(
    RequestRegistration +
      "GetAmountForRequest/" +
      data.requestType +
      "/" +
      data.expiration
  );
}

// emergency or normal request
export function getEstimatedTimeToEmergencyRequest(
  userId: string
): Promise<IResult> {
  http.setToken()
  return http.get(
    GlobalUrl + "GetEstimatedTimeToEmergencyRequest/" + userId
  );
}

//fill category
export function getCategories(): Promise<IResult> {
  http.setToken()
  return http.get(GlobalUrl + "GetServiceCategories");
}

//fill states
export function getStates(): Promise<IResult> {
  http.setToken()
  return http.get(GlobalUrl + "GetStates");
}

//fill cities
export function getCities(stateId: string): Promise<IResult> {
  http.setToken()
  return http.get(GlobalUrl + "GetCities/" + stateId);
}

//fill region
export function getRegions(cityId: string): Promise<IResult> {
  http.setToken()
  return http.get(GlobalUrl + "GetRegions/" + cityId);
}

export function getUserRegion(userId: string): Promise<IResult> {
  http.setToken()
  return http.get(RequestRegistration + "GetUserRegion/" + userId);
}

export function insertRequestRegistration(
  item: IRegisterSave
): Promise<IResult> {
  http.setToken()
  return http.post(RequestRegistration + "InsertRequestRegistration", item);
}
export function balanceValidationRequestRegistration(
  item: IValidationSave
): Promise<IResult> {
  http.setToken()
  return http.post(
    RequestRegistration + "BalanceValidationRequestRegistration",
    item
  );
}

// config
export function getConfigs(): Promise<IResult> {
  http.setToken()
  return http.get(GlobalUrl + "GetConfig");
}

export const postGetAuthorityForPayment = (data: IPayBank): Promise<IResult> => {
  http.setToken()
  return http.post(RequestRegistration + "GetAuthorityForPayment", data);
};
