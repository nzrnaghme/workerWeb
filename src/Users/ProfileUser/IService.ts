import { UserApiUrl, GlobalUrl } from "../../config";
import { IResult } from "../../Services/Entities";
import http from "../../Services/httpService";
import { IAdressInsertDetail } from "./Components/AddressInformation/Entites";
import { MoreInformation, Image, NumberCard, skillUpgrade, IinfoUser } from "./Entities";

export const getClientScore = (userId: string): Promise<IResult> => {
  http.setToken()
  return http.get(GlobalUrl + "GetClientScoreDetails/" + userId);
};
export const getServantScore = (userId: string): Promise<IResult> => {
  http.setToken()
  return http.get(GlobalUrl + "GetServantScoreDetails/" + userId);
};
export const getUserProfileInfo = (MobileNumber: string): Promise<IResult> => {
  http.setToken()
  return http.get(UserApiUrl + "GetUserProfileInfo/" + MobileNumber);
};
export const getSkillCats = (): Promise<IResult> => {
  http.setToken()
  return http.get(GlobalUrl + "GetServiceCategories");
};
export const creditCardsUpdate = (data: NumberCard): Promise<IResult> => {
  http.setToken()
  return http.put(UserApiUrl + "UpdateUserCardNumbers", data);
};
export const skillsUpdate = (data: skillUpgrade): Promise<IResult> => {
  http.setToken()
  return http.put(UserApiUrl + "UpdateUserSkills", data);
};
export const getWalletBalance = (userId: string): Promise<IResult> => {
  http.setToken()
  return http.get(GlobalUrl + "GetWalletBalance/" + userId);
};
export const getStatesList = (): Promise<IResult> => {
  return http.get(GlobalUrl + "GetStates");
};
export const regionUpdate = (data: MoreInformation): Promise<IResult> => {
  http.setToken()
  return http.put(UserApiUrl + "UpdateUserRegion", data);
};
export const emailUpdate = (data: MoreInformation): Promise<IResult> => {
  http.setToken()
  return http.put(UserApiUrl + "UpdateUserEmailAddress", data);
};
export const disabilityUpdate = (data: MoreInformation): Promise<IResult> => {
  http.setToken()
  return http.put(UserApiUrl + "UpdateUserDisability", data);
};
export const bioUpdate = (data: MoreInformation): Promise<IResult> => {
  http.setToken()
  return http.put(UserApiUrl + "UpdateUserBio", data);
};
export const getCitiesList = (stateId: string): Promise<IResult> => {
  http.setToken()
  return http.get(GlobalUrl + "GetCities/" + stateId);
};

export const getRegionList = (cityId: string): Promise<IResult> => {
  http.setToken()
  return http.get(GlobalUrl + "GetRegions/" + cityId);
};

export const getImgVolumeLimit = (): Promise<IResult> => {
  http.setToken()
  return http.get(GlobalUrl + "GetConfig");
};
export const imgUpdate = (data: Image): Promise<IResult> => {
  http.setToken()
  return http.put(UserApiUrl + "UpdateUserPicture", data);
};

export const getCheckImage = (id: string): Promise<IResult> => {
  http.setToken()
  return http.get(GlobalUrl + "HasActiveRequest/" + id);
};

export const getUserRequestScore = (userId: string): Promise<IResult> => {
  http.setToken()
  return http.get(GlobalUrl + "GetUserRequestScore/" + userId);
};

export const getCheckPendingVerifiedPicture = (id: string): Promise<IResult> => {
  http.setToken()
  return http.get(UserApiUrl + "CheckPendingVerifiedPicture/" + id);
};

export const putUpdateUserInfo = (userInfo: IinfoUser): Promise<IResult> => {
  http.setToken()
  return http.put(UserApiUrl + "UpdateUserInfo/", userInfo);
};

export const postInsertUserAddress = (addressInfo: IAdressInsertDetail): Promise<IResult> => {
  http.setToken()
  return http.post(UserApiUrl + "InsertUserAddress", addressInfo);
};
