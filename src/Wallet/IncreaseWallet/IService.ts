import { GlobalUrl, WalletApi } from "../../config";
import { IPay } from "./Entities";
import http from "../../Services/httpService";
import { IResult } from "../../Services/Entities";
import { IPayBank } from "../../Models/Entities";

export const getConfig = (): Promise<IResult> => {
  http.setToken()
  return http.get(GlobalUrl + "GetConfig");
};

export const getWalletBallance = (userId: string): Promise<IResult> => {
  http.setToken()
  return http.get(GlobalUrl + `GetWalletBalance/${userId}`);
};

export const postIncreaseWallet = (data: IPay): Promise<IResult> => {
  http.setToken()
  return http.post(GlobalUrl + "Pay", data);
};

export const postGetAuthorityForPayment = (data: IPayBank): Promise<IResult> => {
  http.setToken()
  return http.post(WalletApi + "GetAuthorityForPayment", data);
};
