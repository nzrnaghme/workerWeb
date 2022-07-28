import { toEnglishNumber, toPersianNumber } from "../hooks/persianHelper";

const numericRegex = /^[\u06F0-\u06F90-9]+$/;

export const maskValue = (value: any, mask: any, maskChar: any) => {
  if (!value || !mask) return value;
  const unmaskedValue = unmaskValue(value, mask);

  let maskedValue = mask;
  for (let index in unmaskedValue) {
    maskedValue = maskedValue.replace(maskChar, unmaskedValue[index]);
  }

  const charIndex = maskedValue.lastIndexOf(
    unmaskedValue[unmaskedValue.length - 1]
  );
  maskedValue = maskedValue.slice(0, charIndex + 1);
  return toPersianNumber(maskedValue);
};

//to unmask values for using them in app level purposes
export const unmaskValue = (value: any, mask: any) => {
  if (!value || !mask) return value;

  let unmaskedValue = "";
  for (let index in mask) {
    let valueChar = value[index];
    let maskChar = mask[index];
    if (!valueChar) break;
    if (valueChar !== maskChar && numericRegex.test(valueChar))
      unmaskedValue += valueChar;
  }
  return toEnglishNumber(unmaskedValue);
};
