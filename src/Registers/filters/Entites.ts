import { SortList } from "../../Models/Enums";

export interface ICheckable {
  name: string;
  id: any;
  isChecked?: boolean;
}
export interface IReqsDate {
  start: Date | undefined;
  end: Date | undefined;
}

export interface IFilterDaily {
  skip: number;
  take: number;
  dailyRequestSorts: SortList;
  requestType: Number[] | null;
  title: string | null;
  regions: string[] | null | undefined;
  endDate: string | null;
  beginDate: string | null;
  presenceType: Number[] | null;
  requestCategoryId?: string[] | null;
  requestUserCategoryId?: string[] | null;
}

export interface IFilterRequestRequests {
  skip: number;
  take: number;
  userId?: string;
  requestType?: Number[] | null;
  regions: string[] | null | undefined;
  endDate: string | null;
  beginDate: string | null;
  presenceType?: Number[] | null;
  requestCategoryId?: string[] | null;
  requestStatus?: string[] | null;
}

export interface IFilterServisecRequests {
  skip: number;
  take: number;
  userId?: string;
  requestType?: Number[] | null;
  regions: string[] | null | undefined;
  endDate: string | null;
  beginDate: string | null;
  presenceType?: Number[] | null;
  requestCategoryId?: string[] | null;
  reportRequestStatus?: string[] | null;
}

export const selectRequestStatus = [
  {
    id: 0,
    name: "ثبت شده",
    isChecked: false,
  },
  {
    id: 1,
    name: "درحال بررسی",
    isChecked: false,
  },
  {
    id: 2,
    name: "عدم تایید درخواست",
    isChecked: false,
  },
  {
    id: 3,
    name: "قابل نمایش",
    isChecked: false,
  },
  {
    id: 4,
    name: "انصراف در مرحله نمایش",
    isChecked: false,
  },
  {
    id: 5,
    name: "انصراف در مرحله بررسی",
    isChecked: false,
  },
  {
    id: 6,
    name: "پذیرش شده",
    isChecked: false,
  },
  {
    id: 7,
    name: "لغو",
    isChecked: false,
  },
  {
    id: 8,
    name: "درحال رسیدن",
    isChecked: false,
  },
  {
    id: 9,
    name: "تایید رسیدن",
    isChecked: false,
  },
  {
    id: 10,
    name: "درحال انجام کار",
    isChecked: false,
  },
  {
    id: 11,
    name: "لغو در مرحله شروع کار",
    isChecked: false,
  },
  {
    id: 12,
    name: "تایید انجام کار",
    isChecked: false,
  },
  {
    id: 13,
    name: "پایان درخواست",
    isChecked: false,
  },
];

export const selectReportRequestStatus = [
  {
    id: 0,
    name: "درحال گفتگو",
    isChecked: false,
  },
  {
    id: 1,
    name: "پذیرش شده",
    isChecked: false,
  },
  {
    id: 2,
    name: "لغو",
    isChecked: false,
  },
  {
    id: 3,
    name: "لغو در مرحله پذیرش",
    isChecked: false,
  },
  {
    id: 4,
    name: "لغو در مرحله انتظار تا رسیدن",
    isChecked: false,
  },
  {
    id: 5,
    name: "لعو در مرحله شروع کار",
    isChecked: false,
  },
  {
    id: 6,
    name: "درحال رسیدن",
    isChecked: false,
  },
  {
    id: 7,
    name: "تایید رسیدن",
    isChecked: false,
  },
  {
    id: 8,
    name: "درحال انجام کار",
    isChecked: false,
  },
  {
    id: 9,
    name: "تایید انجام کار",
    isChecked: false,
  },
  {
    id: 10,
    name: "پایان درخواست",
    isChecked: false,
  },
];
