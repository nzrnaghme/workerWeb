import { UserApiUrl, RequestRegistration, GlobalUrl } from "../../config";
import { IResult } from "../../Services/Entities";
import http from "../../Services/httpService";
import { ISearchRequest } from "./Entites";


export function postAllUserRequest(data: ISearchRequest): Promise<IResult> {
    http.setToken()
    return http.post(UserApiUrl + "GetPresentableFilterRequest", data);
}

export const getCheckProfile = (id: string): Promise<IResult> => {
    http.setToken()
    return http.get(GlobalUrl + "HasProfileImage/" + id);
};
