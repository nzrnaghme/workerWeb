import { RequestRegistration, WalletApi, RequestConfirm } from "../config";
import { IResult } from "../Services/Entities";
import http from "../Services/httpService";

export interface ICheckPayBank {
    userId: string;
    amount: number;
    authority: string;
}

export interface ICheckPayBankConfirm {
    userId: string;
    amount: number;
    authority: string;
    RequestRegistrationId: string,
    url: boolean
}

export const postVerifyAuthorityWallet = (data: ICheckPayBank): Promise<IResult> => {
    http.setToken()
    return http.post(WalletApi + "VerifyAuthority", data);
};

export const postVerifyAuthorityAddRequest = (data: ICheckPayBank): Promise<IResult> => {
    http.setToken()
    return http.post(RequestRegistration + "VerifyAuthority", data);
};

export const postVerifyAuthorityRequestConfirm = (data: ICheckPayBankConfirm): Promise<IResult> => {
    http.setToken()
    return http.post(RequestConfirm + "VerifyAuthority", data);
};