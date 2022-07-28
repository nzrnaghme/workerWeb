import { UserApiUrl, RequestRegistration } from "../config";
import { IResult } from "../Services/Entities";
import http from "../Services/httpService";

export const GetUserProfileInfo = (userId: string): Promise<IResult> => {
    http.setToken()
    return http.get(UserApiUrl + "GetUserProfileInfo/" + userId);
}

export function hasUserPictureAndState(userId: string): Promise<IResult> {
    http.setToken()
    return http.get(RequestRegistration + "HasUserPictureAndState/" + userId);
}

