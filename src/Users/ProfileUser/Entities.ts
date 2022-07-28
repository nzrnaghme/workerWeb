import { IdropDownModel } from "../../Components/Inputs/DropDown"
import { Gender } from "../../Models/Enums"

export interface Iuser {
  nationalCode: string;
  mobileNo: string | undefined;
  firstName: string;
  lastName: string;
  picture: string;
  gender: Gender;
  birthDay: string;
}

export interface IuserInfor {
  firstName: string;
  lastName: string;
  nationalCode: string;
  birthDay: string;
  gender: Gender;
}

export interface IinfoUser {
  userId: string,
  firstName: string,
  lastName: string,
  birthDay: string,
  gender: Gender;
  nationalCode: string
}

export enum Disability {
  MotorDisability,
  DeafnessHearingLoss,
}

export interface Item { name: string; id: any; }

export interface MoreInformation {
  id: any;
  region: string[] | null
  emailAddress: string
  disability?: number[]
  bio: string | undefined
}

export interface IUserInfo {
  Id: string;
  mobileNo: string;
  firstName: string;
  lastName: string;
  userName: string;
  gender: Gender;
  picture: string;
  cardNumber1: string;
  cardNumberNo2: string;
  lastLogin: string;
  token: string;
  nationalCode: string,
  birthDay: string,
  serviceCategoryIds: string[],
  emailAddress: string,
  disability: Disability[],
  region: string[],
  bio: string,
  skill: string,
  verifiedPicture: boolean,
  nonVerifiedPictureReason: string | null,
  rejectedPicture: boolean
}

export interface ClientScore {
  behaviorDislikeCount: number,
  behaviorLikeCount: number,
  cancellationCount: number,
  cancellationInWaitingCount: number,
  cancellationInWorkingCount: number,
  delayCount: number,
  doneCount: number,
  score: number
}

export interface ServantScore {
  behaviorDislikeCount: number,
  behaviorLikeCount: number,
  cancellationCount: number,
  cancellationInWaitingCount: number,
  cancellationInWorkingCount: number,
  costDislikeCount: number,
  costLikeCount: number,
  delayCount: number,
  doneCount: number,
  qualityDislikeCount: number,
  qualityLikeCount: number,
  score: number
}

export interface ICity {
  id: string;
  name: string;
  type: Type;
  parentId?: string;
}

export interface ISkill {
  id: string,
  serviceCategoryIds?: string[]
}

export enum Type {
  State,
  City,
  Region,
}

export interface NumberCard {
  id: string,
  cardNumber1: string | undefined,
  cardNumberNo2: string | undefined
}

export interface Image {
  id: string,
  picture: string | null
}
export interface skillUpgrade {
  id?: string,
  skill?: string,
  serviceCategoryIds?: string[]
}

export const disablityOptions = [
  {
    id: Disability.MotorDisability,
    name: "ناتوانی حرکتی",
  },
  {
    id: Disability.DeafnessHearingLoss,
    name: "ناشنوایی / کم شنوایی",
  },
]
