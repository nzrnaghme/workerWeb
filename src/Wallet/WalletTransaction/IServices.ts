import { WalletApi } from "../../config";
import { IResult } from "../../Services/Entities";
import http from "../../Services/httpService";
import { IDateTransactionWallet } from "./Entites";


export const postGetWalletTransactions = (dateForTransactions: IDateTransactionWallet): Promise<IResult> => {
    http.setToken()
    return http.post(WalletApi + "GetWalletTransactions", dateForTransactions);
};

