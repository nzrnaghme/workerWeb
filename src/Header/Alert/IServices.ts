import { UserApiUrl } from "../../config";
import { IResult } from "../../Services/Entities";
import http from "../../Services/httpService";

export const getUserNotification = (userId: string): Promise<IResult> => {
    return http.get(UserApiUrl + "GetUserNotification/" + userId);
};

export const putViewedNotification = (notificationId: string): Promise<IResult> => {
    return http.put(UserApiUrl + "ViewedNotification/" + notificationId);
};