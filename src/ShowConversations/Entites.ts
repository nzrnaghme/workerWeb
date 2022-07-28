export interface IRequestMessage{
    requestUserId:string, 
    servantUserId:string, 
    getUserAllMessages: IAllMessage
}

export interface IAllMessage{
    requestConfirmMassage:[]
    requestWaitingMassage:[]
    requestWorkingMassage:[]
}