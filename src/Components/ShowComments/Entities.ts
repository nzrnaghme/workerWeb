import { SurveyType } from "../../Models/Enums";

export interface MyComments {
  description: string;
  quality: SurveyType | null;
  cost: SurveyType | null;
  behavior: SurveyType | null;
  date: string;
}
