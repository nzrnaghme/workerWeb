import { WalletOperation } from "../../Models/Enums"

export interface ITransactionWallet {
    amount: number,
    transactionDate: string,
    walletOperation: WalletOperation,
    title: string
}

export interface IDateTransactionWallet {
    userId: string,
    beginDate: string | null,
    endDate: string | null
}