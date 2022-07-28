import { GlobalUrl, UserApiUrl} from "../../config";
import { IResult } from "../../Services/Entities";
import http from "../../Services/httpService";
import { Iuser } from "./Entities";

export const getImgVolumeLimit = (): Promise<IResult> => {
    return http.get(GlobalUrl + 'GetConfig')
}

export const insertUser = (user: Iuser): Promise<IResult>=> {
    return http.post(UserApiUrl + 'InsertUser', user)
}
