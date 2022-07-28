import { Gender } from "../../Models/Enums";

export const genderNameMaker = (gender: Gender) => {
  switch (gender) {
    case Gender.Male:
      return "مرد";
    case Gender.Female:
      return "زن";
    case Gender.Transgender:
      return "ترنس";
    case Gender.Transwoman:
      return "تغییر جنسیت داده به خانم";
    case Gender.Transman:
      return "تغییر جنسیت داده به آقا";
  }
};
