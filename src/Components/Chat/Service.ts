import { GlobalUrl } from "../../config";
import { MsgsState } from "../../Models/Enums";
import { IResult } from "../../Services/Entities";
import http from "../../Services/httpService";

export const getFileMsg = (
  fileId: string,
  state: MsgsState
): Promise<IResult> => {
  http.setToken()
  return http.get(
    GlobalUrl + "GetMessageFileById/" + fileId + "/" + state
  );
};
