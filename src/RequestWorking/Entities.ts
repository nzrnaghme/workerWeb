import { IMessage } from "../Models/Entities";
import { PresenceTypeCategory } from "../Models/Enums";

interface IUserMsgs {
  requestConfirmMassage: IMessage[] | [];
  requestWaitingMassage: IMessage[] | [];
  requestWorkingMassage: IMessage[] | [];
}

export interface INecessities {
  confirm: {
    presenceType: PresenceTypeCategory;
    requestRegistrationId: string;
    requestWaitingId: string;
    requestWorkingId: string;
    requestUserId: string;
    servantUserId: string;
    clientMobileNo: string | null;
    servantMobileNo: string | null;
    hasStartWorkingDate: boolean;
  };
  config: {
    cfgUserRegistrationPicVolumeSize: number;
    cfgRequestRegistrationFileVolumeSize: number;
  };
  userMessages: IUserMsgs;
}

export interface IUpdateReqWorking {
  requestWorkingId: string;
  duration: string;
}

export interface IInsertReqWorkingSecurity {
  userId: string;
  requestWorkingId: string;
}

export interface IUpdateSecurity {
  id: string;
  reason: string;
}

export interface IRefuseReqWorking {
  requestWorkingId: string;
  requestRegistrationId: string;
  requestUserId: string;
  canceledDescription: string;
  servantUserId: string;
}

export interface IConfirmReqWorking {
  requestWorkingId: string;
  requestRegistrationId: string;
  requestUserId: string;
  servantUserId: string;
}
