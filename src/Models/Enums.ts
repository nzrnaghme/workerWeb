export enum Gender {
  Male,
  Female,
  Transgender,
  Transwoman,
  Transman,
}

export enum Disability {
  MotorDisability,
  DeafnessHearingLoss,
}

export enum FileType {
  Doc,
  Image,
  Video,
  Audio,
  RecordedAudio,
}

export enum MsgsState {
  RequestConfirm,
  RequestWaiting,
  RequestWorking,
}

export enum OperatorType {
  Client,
  Servant,
}

export enum SurveyType {
  Like,
  DisLike,
}

export enum RequestType {
  Normal,
  Emergency,
}

export enum PresenceTypeCategory {
  Presence,
  UnPresence,
}

export enum SortList {
  DescendingByDate,
  AscendingByDate,
  DescendingByScore,
  AscendingByScore,
}

//login
export enum SMSStatus {
  SentSms,
  FailedSms,
  SucceedSms,
  UsedCode,
}
export enum LoginResult {
  WrongCode,
  VerifiedLogin,
  NewUser,
  BlockedUser,
  UsedCode,
}

//TODO:
export interface IPhoneNumberSave {
  mobileNo: string;
}

export interface ILoginSave {
  mobileNo: string;
  code: number;
}

export enum RequestStatus {
  Registered,
  Pending,
  Reject,
  Presentable,
  PresentableCanceled,
  PendingCanceled,
  Confirm,
  Canceled,
  WaitingToArrive,
  Arrived,
  Working,
  CanceledInWorking,
  Done,
  EndOfRequest,
}

export enum ConfirmStatus {
  Accepted,
  Confirmed,
  Canceled,
  Reported,
}

export enum TypeAttach {
  Doc,
  Image,
  Video,
  Audio,
}

export enum Priority {
  Normal,
  High,
}

export enum RequestStep {
  None,
  Confirm,
  Waiting,
  Working,
  OpinionPoll,
}

export enum WalletOperation {
  Input,
  OutPut,
  ReturnToAccountNo,
  ReturnToWallet,
  InputByCancel,
  InputForRequestRegistration,
  OutPutForRequestRegistration,
  InputForAcceptRequest,
  InputForConfirmRequest,
  OutPutForConfirmRequest,
  OutPutByCancel,
  InputForFreeEmergency,
  OutPutForFreeEmergency,
  ReturnCancelPriceToWallet,
}

export enum ReportRequestStatus {
  Accepted,
  Confirm,
  Canceled,
  CanceledInConfirm,
  CanceledInWaitingToArrive,
  CanceledInWorking,
  WaitingToArrive,
  Arrived,
  Working,
  Done,
  EndOfRequest,
}

//confirm
export enum ConfirmOperation {
  Valid,
  Invalid,
  DateInvalid,
}

export enum ReportConfirmStatus {
  Confirm,
  Rejected,
  Canceled,
}


export enum RequestStepServant {
  None,
  Confirm,
  Waiting,
  Working,
  OpinionPoll,
}

export enum RootFilter {
  All,
  NormalFilter,
  EmergencyFilter,
  Suggestion,
}


