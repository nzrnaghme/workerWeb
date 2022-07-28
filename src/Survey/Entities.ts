import { OperatorType, SurveyType } from "../Models/Enums";

export interface IReqInfo {
  requestRegistrationId: string;
  requestUserId: string;
  servantUserId: string;
}

export interface IReqScore {
  userId: string;
  requestRegistrationId: string;
  behavior: SurveyType | null;
  quality: SurveyType | null;
  cost: SurveyType | null;
  description: string | null;
  requestConfirmId: string;
}

export interface IMatch {
  reqConfirmId: string;
}
