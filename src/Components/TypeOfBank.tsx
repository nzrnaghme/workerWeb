import React from "react";
import Eghtesad from "../Users/ProfileUser/logo/Eghtesad.png";
import Iranzamin from "../Users/ProfileUser/logo/Iranzamin.png";
import Tejarat from "../Users/ProfileUser/logo/Tejarat.png";
import ToseeSaderat from "../Users/ProfileUser/logo/ToseeSaderat.png";
import Day from "../Users/ProfileUser/logo/Day.png";
import Maskan from "../Users/ProfileUser/logo/Maskan.png";
import Sepah from "../Users/ProfileUser/logo/Sepah.png";
import Shahr from "../Users/ProfileUser/logo/Shahr.png";
import Refah from "../Users/ProfileUser/logo/Refah.png";
import Melli from "../Users/ProfileUser/logo/Melli.png";
import Mellat from "../Users/ProfileUser/logo/Mellat.png";
import Mehr from "../Users/ProfileUser/logo/Mehr.png";
import Saderat from "../Users/ProfileUser/logo/Saderat.png";
import Sarmayeh from "../Users/ProfileUser/logo/Sarmayeh.png";
import ToseeTaavon from "../Users/ProfileUser/logo/ToseeTaavon.png";
import Saman from "../Users/ProfileUser/logo/Saman.png";
import Sanatvamadan from "../Users/ProfileUser/logo/Sanatvamadan.png";
import PostBank from "../Users/ProfileUser/logo/PostBank.png";
import Agri from "../Users/ProfileUser/logo/Agri.png";
import Gardeshgar from "../Users/ProfileUser/logo/Gardeshgar.png";
import Sina from "../Users/ProfileUser/logo/Sina.png";
import Karafarin from "../Users/ProfileUser/logo/Karafarin.png";
import Ayandeh from "../Users/ProfileUser/logo/Ayandeh.png";
import Pasargad from "../Users/ProfileUser/logo/Pasargad.png";
import Resalat from "../Users/ProfileUser/logo/Resalat.png";
import Parsian from "../Users/ProfileUser/logo/Parsian.png";
import BankMarkazi from "../Users/ProfileUser/logo/BankMarkazi.png";
import tosee from "../Users/ProfileUser/logo/tosee.png";

function TypeOfBank(numberCard: string) {
  if (numberCard === null) return "";
  let Type = numberCard.slice(0, 6);
  let typeNew = parseInt(Type);

  switch (typeNew) {
    case 627412:
      return Eghtesad;

    case 505785:
      return Iranzamin;

    case 622106:
    case 639194:
    case 627884:
      return Parsian;

    case 639347:
    case 502229:
      return Pasargad;

    case 636214:
      return Ayandeh;

    case 636214:
    case 627353:
    case 585983:
      return Tejarat;

    case 504172:
      return Resalat;

    case 502908:
      return ToseeTaavon;

    case 207177:
    case 627648:
      return ToseeSaderat;

    case 502938:
      return Day;

    case 589463:
      return Refah;

    case 621986:
      return Saman;

    case 589210:
    case 627381:
    case 636949:
    case 505801:
    case 639370:
    case 639599:
      return Sepah;

    case 639607:
      return Sarmayeh;

    case 639346:
      return Sina;

    case 504706:
    case 502806:
      return Shahr;

    case 603769:
      return Saderat;

    case 627961:
      return Sanatvamadan;

    case 606373:
      return Mehr;

    case 502910:
    case 627488:
      return Karafarin;

    case 639217:
    case 603770:
      return Agri;

    case 505416:
      return Gardeshgar;

    case 639346:
      return Sina;

    case 636795:
      return BankMarkazi;

    case 628023:
      return Maskan;

    case 991975:
    case 610433:
      return Mellat;

    case 603799:
      return Melli;

    case 627760:
      return PostBank;

    case 628157:
      return tosee;

    default:
      return "";
  }
}

export default TypeOfBank;
