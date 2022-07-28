import { GlobalUrl, RequestReportApi } from "../config";
import { MsgsState } from "../Models/Enums";
import { IResult } from "../Services/Entities";
import http from "../Services/httpService";


export const getProfileSummaryInfo = (id: string): Promise<IResult> => {
  http.setToken()
  return http.get(GlobalUrl + "GetSummaryUserProfileInfo/" + id);
};

export const GetRequestUserMessage = (reqConfirmId: string, userId: string): Promise<IResult> => {
  http.setToken()
  return http.get(
    RequestReportApi + "GetRequestUserMessage/" + reqConfirmId + "/" + userId
  );
};

export const getFileByStateAndId = (state: MsgsState, fileId: string): Promise<IResult> => {
  http.setToken()
  return http.get(RequestReportApi + "GetFileById/" + state + "/" + fileId);
};
