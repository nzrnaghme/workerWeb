import {
  addCommas,
  digitsEnToFa,
  digitsFaToEn,
  verifyCardNumber,
  numberToWords,
} from "@persian-tools/persian-tools";

export const toPersianCurrency = (no: number | string) =>
  digitsEnToFa(addCommas(no));

export const toPersianNumber = (no: number | string) => digitsEnToFa(no);

export const toEnglishNumber = (no: string) => digitsFaToEn(no);

export const validationOfNumberCard = (no: number) => verifyCardNumber(no);

export const wordsNumberofWallet = (no: string) => numberToWords(no);
