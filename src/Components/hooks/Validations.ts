import { toEnglishNumber, toPersianNumber } from "./persianHelper";

export const validateTitelAddRequest = (value: string) => {
    let error;
    if (/^[" "]+$/i.test(value)) error = "لطفا حروف وارد کنید";
    else if (/^["."]+$/i.test(value)) error = "لطفا حروف وارد کنید";
    else if (/^["."." "]+$/i.test(value)) error = "لطفا حروف وارد کنید";
    else if (/^[" "."."]+$/i.test(value)) error = "لطفا حروف وارد کنید";
    return error;
};

export const validateNationalCode = (value: string) => {
    let error;
    let size = value.length;
    if (!/^[\u06F0-\u06F9.0-9."-"]+$/i.test(value)) {
        error = "لطفا عدد وارد کنید";
    } else if (size < 10) {
        error = `کد ملی ${toPersianNumber(10)} رقم است`
    }
    const validateCodeMeli = checkCodeMeli(toEnglishNumber(value))
    if (validateCodeMeli === false) {
        error = "کد ملی نامعتبر است!"
    }
    return error;
};


function checkCodeMeli(code: string) {
    var L = code.length;

    if (L < 8 || parseInt(code, 10) == 0) return false;
    code = ('0000' + code).substr(L + 4 - 10);
    if (parseInt(code.substr(3, 6), 10) == 0) return false;
    var c = parseInt(code.substr(9, 1), 10);
    var s = 0;
    for (var i = 0; i < 9; i++)
        s += parseInt(code.substr(i, 1), 10) * (10 - i);
    s = s % 11;
    return (s < 2 && c == s) || (s >= 2 && c == (11 - s));
}


export const validateName = (value: string) => {
    value = value.trim()
    let error;
    if (
        !/^[\u0622\u0627\u0628\u067E\u062A-\u062C\u0686\u062D-\u0632\u0698\u0633-\u063A\u0641\u0642\u06A9\u06AF\u0644-\u0648\u06CC\u0626 ." "]+$/i.test(
            value
        )
    ) {
        error = "لطفا حروف فارسی وارد کنید";
    } else if (
        /^[" "].[\u0622\u0627\u0628\u067E\u062A-\u062C\u0686\u062D-\u0632\u0698\u0633-\u063A\u0641\u0642\u06A9\u06AF\u0644-\u0648\u06CC\u0626." "]+$/i.test(
            value
        )
    ) {
        error = "لطفا حروف فارسی وارد کنید";
    } else if (
        /^[" "]+[\u0622\u0627\u0628\u067E\u062A-\u062C\u0686\u062D-\u0632\u0698\u0633-\u063A\u0641\u0642\u06A9\u06AF\u0644-\u0648\u06CC\u0626." "]$/i.test(
            value
        )
    ) {
        error = "لطفا حروف فارسی وارد کنید";
    } else if (
        /^[\u0622\u0627\u0628\u067E\u062A-\u062C\u0686\u062D-\u0632\u0698\u0633-\u063A\u0641\u0642\u06A9\u06AF\u0644-\u0648\u06CC\u0626." "]+[" "]$/i.test(
            value
        )
    ) {
        error = "لطفا حروف فارسی وارد کنید";
    }
    else if (value.length < 2) {
        error = "کمتر از حد مجاز";
    }

    return error;
};

export const validateEmail = (value: string) => {
    let error;
    if (value === "") {
        return;
    } else if (!/^[A-Z0-9#$%&‘*+–/=?^_`.{|}~]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        error = "ایمیل اشتباه وارد شده.";
    }
    return error;
};

