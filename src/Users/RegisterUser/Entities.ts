import { Gender } from "../../Models/Enums";

export interface Iuser {
  mobileNo: string | undefined;
  firstName: string;
  lastName: string;
  picture: string | null;
  gender: Gender;
}

export const genderOptions = [
  {
    id: Gender.Male,
    name: "آقا",
  },
  {
    id: Gender.Female,
    name: "خانم",
  },
  {
    id: Gender.Transgender,
    name: "ترنس",
  },
  {
    id: Gender.Transwoman,
    name: "تغییر جنسیت داده به خانم",
  },
  {
    id: Gender.Transman,
    name: "تغییر جنسیت داده به آقا",
  },
];

export const msg =
  "لطفا عکس تمام رخ و فقط از صورت باشد.";
