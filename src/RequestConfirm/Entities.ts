import { IMessage } from "../Models/Entities";
import { WalletOperation, PresenceTypeCategory } from "../Models/Enums";

export interface UserInfoSummary {
  id: string;
  firstName: string;
  lastName: string;
  picture: string;
}

export interface IInfoGlobalConfigs {
  price: number;
  cancelPrice: number;
}

export interface IMobileNos {
  clientNo: string | null;
  servantNo: string | null;
}

export interface IInitialize {
  userId: string;
  requestConfirmId: string | null;
  requestRegistrationId: string | null;
}

export interface IInitializeModel {
  getInitialize: INecessities;
  infoModel: INecessitiesBefore;
}

export interface INecessities {
  requestConfirmMessage: IMessage[] | [];
  config: {
    cfgUserRegistrationPicVolumeSize: number;
    cfgRequestRegistrationFileVolumeSize: number;
    cfgRequestRegistrationCancelPrice: number;
    cfgRequestRegistrationPrice: number;
  };
  clientNo: string | null;
  servantNo: string | null;
  requestRegistrationId: string;
  requestConfirmId: string;
  servantUserId: string;
  requestUserId: string;
}
export interface INecessitiesBefore {
  title: string;
  content: string;
  presenceType: PresenceTypeCategory;
  userId: string;
}

export interface IRequestDetails {
  title: string;
  content: string;
  presenceType: PresenceTypeCategory;
}

export interface IReqLocationInfo {
  requestRegistrationId: string;
  region: string[] | null;
  location: {
    name: string | null;
    latitude: number | null;
    longitude: number | null;
    date: string | null;
  };
  locationName: string | null;
}

export interface IPay {
  userId: string;
  amount: number;
  trackingCode: string;
  requestRegistrationId: string;
  walletOperation: WalletOperation;
}
