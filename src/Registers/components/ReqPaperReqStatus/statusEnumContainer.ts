import {
    RequestStatus,
    ReportRequestStatus,
    WalletOperation
} from "../../../Models/Enums";
import { faPlus, faCarSide, faCogs, faTimesCircle, faCheck, faBriefcase, faHourglassHalf, faHourglassStart, faComment } from "@fortawesome/free-solid-svg-icons";

export const iconRequestStatus = (icon: RequestStatus | undefined) => {
    switch (icon) {
        case 1:
            return faHourglassStart;
        case 3:
            return faHourglassHalf;
        case 0:
            return faCogs;
        case 2:
        case 4:
        case 5:
        case 7:
        case 11:
            return faTimesCircle;
        case 6:
        case 12:
        case 13:
            return faCheck;
        case 8:
        case 9:
            return faCarSide;
        case 10:
            return faBriefcase;
    }
}


export const titleRequestStatus = (type: RequestStatus | undefined) => {
    switch (type) {
        case 0:
            return "ثبت شده";
        case 1:
            return "در حال بررسی";
        case 2:
            return "عدم تایید درخواست";
        case 3:
            return "قابل نمایش";
        case 4:
            return "انصراف در مرحله نمایش";
        case 5:
            return "انصراف در مرحله بررسی";
        case 6:
            return "پذیرش شده";
        case 7:
            return "لغو شده";
        case 8:
            return "درحال رسیدن";
        case 9:
            return "تایید رسیدن";
        case 10:
            return "درحال انجام کار";
        case 11:
            return " لغو در مرحله شروع کار";
        case 12:
            return "تایید انجام کار";
        case 13:
            return "پایان درخواست";
    }
};

export const iconReportRequest = (icon: ReportRequestStatus | undefined) => {
    switch (icon) {
        case 0:
            return faComment;
        case 6:
        case 7:
            return faCarSide;
        case 3:
        case 4:
        case 5:
        case 2:
            return faTimesCircle;
        case 1:
        case 9:
        case 10:
            return faCheck;
        case 8:
            return faBriefcase;
    }
}

export const colorReportRequest = (color: ReportRequestStatus | undefined) => {
    switch (color) {
        case 0:
            return faHourglassHalf;
        case 6:
        case 8: return "blue";
        case 1:
        case 7:
        case 9:
        case 10: return "white";
        case 2:
        case 3:
        case 4:
        case 5: return "red";
    }
}

export const titleReportRequest = (type: ReportRequestStatus | undefined) => {
    switch (type) {
        case 0:
            return "درحال گفتگو";
        case 1:
            return "پذیرش شده";
        case 2:
            return "لغو";
        case 3:
            return "لغو در مرحله پذیرش";
        case 4:
            return "لغو در مرحله انتظار تا رسیدن";
        case 5:
            return "لغو در مرحله شروع کار";
        case 6:
            return "درحال رسیدن";
        case 7:
            return "تایید رسیدن";
        case 8:
            return "در حال انجام کار";
        case 9:
            return "تایید انجام کار";
        case 10:
            return "پایان درخواست";
    }
};

export const iconWalletOperation = (icon: WalletOperation | undefined) => {
    switch (icon) {
        case 0:
        case 2:
        case 3:
        case 7:
        case 8:
        case 9:
            return faPlus;
        case 1:
        case 4:
        case 5:
        case 6:
        case 10:
        case 11:
        case 12:
            return faHourglassHalf;
    }
}


export const titleWalletOperation = (type: WalletOperation | undefined) => {
    switch (type) {
        case 0:
            return "واریز";
        case 1:
            return "برداشت";
        case 2:
            return "برگشت پول به حساب فرد";
        case 3:
            return "برگشت پول به کیف پول";
        case 4:
            return "واریز به دلیل لغو درخواست از سوی طرف مقابل";
        case 5:
            return "واریز در ثبت درخواست";
        case 6:
            return "برداشت در ثبت درخواست";
        case 7:
            return "واریز در پذیرش بابت انجام درخواست";
        case 8:
            return "واریز در تایید بابت انجام درخواست";
        case 9:
            return "برداشت در تایید بابت انجام درخواست";
        case 10:
            return "برگشت به دلیل لغو درخواست";
        case 11:
            return "واریز به دلیل استفاده درخواست اضطراری رایگان";
        case 12:
            return "برگشت به دلیل استفاده درخواست اضطراری رایگان";
        case 13:
            return "برگشت حق فسخ";
    }
};