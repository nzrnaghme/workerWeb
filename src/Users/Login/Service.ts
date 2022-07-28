import { UserApiUrl } from "../../config";
import Http from "../../Services/httpService";
import { IPhoneNumberSave, ILoginSave } from "../../Models/Enums";
import { IResult } from "../../Services/Entities";

export function insertVerificationCode(item: IPhoneNumberSave): Promise<IResult> {
  return Http.post(UserApiUrl + "InsertVerificationCode", item);
}
export function login(item: ILoginSave): Promise<IResult> {
  return Http.post(UserApiUrl + "Login", item);
}
export function getUserInfo(mobileNo: string): Promise<IResult> {
  Http.setToken()
  return Http.get(UserApiUrl + "GetUserInfo/" + mobileNo);
}
export function getLastSentSms(mobileNo: string): Promise<IResult> {
  return Http.get(UserApiUrl + "GetLastSentSms/" + mobileNo);
}
