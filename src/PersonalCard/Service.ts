import { GlobalUrl, UserApiUrl } from "../config";
import { OperatorType } from "../Models/Enums";
import { IResult } from "../Services/Entities";
import http from "../Services/httpService";

export const getSummaryUserInfo = (userId: string, operatorType: OperatorType): Promise<IResult> => {
  http.setToken()
  return http.get(
    GlobalUrl + "GetSummaryUserInfo/" + userId + "/" + operatorType
  );
}
