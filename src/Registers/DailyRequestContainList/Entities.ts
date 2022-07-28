
import { Gender, RequestType, PresenceTypeCategory, SortList, WalletOperation } from "../../Models/Enums";
import LowerstScore from "./Img/LowestScore.svg"
import LowerstTime from "./Img/LowestTime.svg"
import MaximumScore from "./Img/MaximumScore.svg"
import MaximumTime from "./Img/MaximumTime.svg"

export interface IPresentableRequest {
    id: string,
    presenceType: PresenceTypeCategory,
    presenceTypeText: string,
    title: string,
    region: string[],
    requestCategory: string,
    clientScore: number,
    userId: string,
    content: string,
    gender: Gender,
    beginDate: string,
    beginTime: string,
    requestDate: string,
    requestType: RequestType,
}

export interface DetailScore {
    behaviorLike: number,
    behaviorDislike: number,
    cancellation: number,
    confirmed: number,
    done: number,
    cancellationLevelPercent: number
}

export interface IFilter {
    skip: number;
    take: number;
    dailyRequestSorts: SortList;
    requestType: Number[] | null;
    title: string | null;
    regions: string[] | null;
    endDate: string | null;
    beginDate: string | null;
    presenceType: Number[] | null;
    requestCategoryId?: string[] | null;
    requestUserCategoryId?: string[] | null;
}

export interface AllFilter {
    skip: number;
    take: number;
    isRequestDateAscending: boolean;
    requestType?: RequestType;
}


export interface IConfig {
    id: string,
    cfgUserRegistrationPicVolumeSize: number,
    cfgRequestRegistrationNormalActivityDuration: number,
    cfgRequestRegistrationFileVolumeSize: number,
    cfgRequestRegistrationFileCount: number,
    cfgRequestRegistrationEmergencyActivityDuration: number,
    cfgRequestRegistrationPrice: number,
    cfgRequestRegistrationShowPeriodPrice: number,
    cfgRequestRegistrationCancelPrice: number,
    cfgRequestRegistrationEmergencyRecentPeriod: number,
    cfgAdvertisementActivityDuration: number,
    cfgAdvertisementRegistrationPrice: number,
    cfgAdvertisementRegistrationShowPeriodPrice: number,
    cfgLocationUpdateTime: number
}

export interface InsertData {
    requestRegistrationId: string,
    requestUserId: string,
    servantUserId: string
}

export interface InsertWallet {
    userId: string,
    IsPaySuccessFul: boolean,
    amount: number,
    trackingCode: string,
    requestRegistrationId: string,
    walletOperation: WalletOperation,
}



export const selectOptions = [
    {
        id: 0,
        name: 'جدید ترین',
        icon: MaximumTime
    },
    {
        id: 1,
        name: 'قدیمی ترین',
        icon: LowerstTime
    },
    {
        id: 2,
        name: 'بالاترین امتیاز',
        icon: MaximumScore
    },
    {
        id: 3,
        name: 'پایین ترین امتیاز',
        icon: LowerstScore
    }
]

export interface ILocation {
    stateId: string | undefined;
    cityId: string | undefined;
    regionId: string | undefined;
}


