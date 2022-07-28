import { GlobalUrl, UserApiUrl } from "../config";
import { RequestRegistration, WalletApi } from "../config";
import { IResult } from "../Services/Entities";
import http from "../Services/httpService";

export const GetEmergencyRequest = (): Promise<IResult> => {
  return http.get(UserApiUrl + "GetPresentableEmergencyRequest");
};

export const GetNormalRequest = (): Promise<IResult> => {
  return http.get(UserApiUrl + "GetPresentableNormalRequest");
};

export const GetSuggestedRequest = (id: string): Promise<IResult> => {
  http.setToken()
  return http.get(UserApiUrl + "GetPresentableSuggestedRequest/" + id);
};

export const getCheckProfile = (id: string): Promise<IResult> => {
  http.setToken()
  return http.get(GlobalUrl + "HasProfileImage/" + id);
};

export function hasUserPictureAndState(userId: string): Promise<IResult> {
  http.setToken()
  return http.get(RequestRegistration + "HasUserPictureAndState/" + userId);
}

export const getWalletBallance = (userId: string): Promise<IResult> => {
  http.setToken()
  return http.get(GlobalUrl + `GetWalletBalance/${userId}`);
};