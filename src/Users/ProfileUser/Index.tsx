import React, { useEffect, useState, useRef } from "react";
import "./index.scss";
import ScoreUser from "./Components/UserScores";
import PersonalInformation from "./Components/PersonalInformation/";
import Skill from "./Components/Skills";
import AccountInformation from "./Components/AccountInformation";
import MoreInformationField from "./Components/MoreInformation";
import * as service from "./IService";
import {
  ClientScore,
  ServantScore,
  IUserInfo,
  NumberCard,
  MoreInformation,
  Image,
  skillUpgrade,
  IinfoUser,
  IuserInfor,
} from "./Entities";
import { IdropDownModel } from "../../Components/Inputs/DropDown";
import { toast } from "react-toastify";
import { IResult } from "../../Services/Entities";
import { addLocalStorage, showLocalStorage } from "../../Routers/localStorage";
import imagePicker from "../../Components/FileUploader/imagePicker";
import { useGeneralContext } from "../../Providers/GeneralContext";
import { trackPromise } from "react-promise-tracker";

const msg = "لطفا عکس تمام رخ و فقط از صورت باشد.";

const removeImgHint =
  "در صورت حذف عکس امکان ثبت درخواست یا انجام خدمت را نخواهید داشت. آیا حذف می کنید؟";

function Profile() {
  const storageUser = showLocalStorage("user");

  const [imgVolumeLimit, setImgVolumeLimit] = useState(400);
  const [imgLimitViolated, setImgLimitViolated] = useState(false);
  const [img, setImg] = useState<string | null>(null);
  const upsertImgRef = useRef<HTMLInputElement>(null);
  const [verifiedPicture, setVerifiedPicture] = useState(false);
  const [rejectedPicture, setRejectedPicture] = useState(false);
  const [clientScoreDetail, setClientScoreDetail] = useState<
    ClientScore | undefined
  >();
  const [servantScore, setServantScore] = useState<ServantScore | undefined>();
  const [person, setPerson] = useState<IUserInfo>();
  const [skillCatOptions, setSkillCatOptions] = useState<IdropDownModel[]>([]);
  const { onConfirmSetter, setConfirmPopupOpen } = useGeneralContext();
  const [credit, setCredit] = useState<string | undefined>("");
  const [imgRef, setImgRef] = useState(false);

  useEffect(() => {
    if (storageUser != null) {
      trackPromise(SkillCatsFiller());
      trackPromise(clientScoreFiller(storageUser!.Id));
      trackPromise(servantScoreFiller(storageUser!.Id));
      trackPromise(walletFiller(storageUser!.Id));
      trackPromise(imgVolumeThreshold());
      trackPromise(personalInformation(storageUser!.Id));
    }
  }, []);

  useEffect(() => {
    if (!imgRef) return;
    upsertImgRef.current!.click();
  }, [imgRef]);

  //Image
  const imgVolumeThreshold = async () => {
    const res: IResult = await service.getImgVolumeLimit();
    if (res.Error != null) return;
    const volume = res.Data.cfgUserRegistrationPicVolumeSize;
    setImgVolumeLimit(volume * 1024);
  };

  //Sore
  const clientScoreFiller = async (userId: string) => {
    const client: IResult = await service.getClientScore(userId);
    if (client.Error != null) return;

    let clientscoreData: ClientScore = client.Data as ClientScore;
    if (clientscoreData != null) setClientScoreDetail(clientscoreData);
  };

  const servantScoreFiller = async (userId: string) => {
    const servant: IResult = await service.getServantScore(userId);

    if (servant.Error != null) return;
    let servantscoreData: ServantScore = servant.Data as ServantScore;
    if (servantscoreData != null) setServantScore(servantscoreData);
  };

  //Image Profile
  const removeImgOkHandler = async () => {
    trackPromise(imgUpdateHandler(null));
  };

  const RemovePhoto = async () => {
    if (storageUser != null) {
      const varient: IResult = await service.getCheckImage(storageUser.Id);
      if (varient.Error != null) return;
      if (varient.Data === true) {
        toast.warning(
          "به دلیل وجود درخواست فعال امکان تغییر عکس پروفایل وجود ندارد"
        );
        return;
      } else {
        const varientToUpdate: IResult =
          await service.getCheckPendingVerifiedPicture(storageUser.Id);
        if (varientToUpdate.Data === true) {
          toast.warning(
            "عکس قبلی درحال بررسی توسط پشتیبانی میباشد. درحال حاضر امکان حذف یا تغییر عکس وجود ندارد"
          );
          return;
        }
        onConfirmSetter(removeImgHint, removeImgOkHandler);
        setConfirmPopupOpen(true);
        return;
      }
    }
  };

  const addImgOkHandler = async () => {
    if (storageUser != null) {
      if (img != null) {
        const varient: IResult = await service.getCheckImage(storageUser.Id);
        if (varient.Error != null) return;
        if (varient.Data === true) {
          toast.warning(
            "به دلیل وجود درخواست فعال امکان تغییر عکس پروفایل وجود ندارد"
          );
          return;
        } else {
          const varientToUpdate: IResult =
            await service.getCheckPendingVerifiedPicture(storageUser.Id);
          if (varientToUpdate.Data === true) {
            toast.warning(
              "عکس قبلی درحال بررسی توسط پشتیبانی میباشد. درحال حاضر امکان حذف یا تغییر عکس وجود ندارد"
            );
            return;
          }
          toast.info(msg);
          upsertImgRef.current!.value = "";
          setImgRef(true);
          return;
        }
      } else {
        toast.info(msg);
        upsertImgRef.current!.click();
      }
    }
  };

  const onUploadingImg = async (e: any) => {
    const files = e.target.files[0];
    if (
      files.type === "image/png" ||
      files.type === "image/jpeg" ||
      files.type === "image/jpg"
    ) {
      let blob: Blob | undefined = await imagePicker(files);
      if (blob === undefined) return;
      if (blob.size > imgVolumeLimit) {
        setImgLimitViolated(true);
        toast.error("حجم عکس بیش از حد مجاز است.");
        return;
      }

      setImgLimitViolated(false);
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        trackPromise(imgUpdateHandler(reader.result as string));
      };
    } else {
      toast.error("فرمت فایل درست نیست.");
      return;
    }
  };

  const imgUpdateHandler = async (img: string | null) => {
    if (storageUser != null) {
      const data: Image = {
        id: storageUser?.Id,
        picture: img,
      };

      if (imgLimitViolated) return;
      await service.imgUpdate(data);
      setImg(img);
      setVerifiedPicture(false);
      setRejectedPicture(false);
    }
  };

  //UserInfo
  const personalInformation = async (userId: string) => {

    const person: IResult = await service.getUserProfileInfo(userId);
    if (person.Error != null) return;
    let personData = person.Data as IUserInfo;

    setImg(personData.picture);
    setVerifiedPicture(personData.verifiedPicture);
    setRejectedPicture(personData.rejectedPicture);
    setPerson(personData);
  };

  //Skill
  const SkillCatsFiller = async () => {
    const res: IResult = await service.getSkillCats();
    setSkillCatOptions(res.Data);
  };

  const skillsUpdateHandler = async (
    serviceCategoryIds: string[] | undefined,
    skill: string | undefined
  ) => {
    const data: skillUpgrade = {
      id: storageUser!.Id,
      serviceCategoryIds,
      skill,
    };

    const res: IResult = await service.skillsUpdate(data);
    toast.success("تغییرات اعمال شد.");
    if (res.Error != null) {
      toast.error("تغییرات ثبت نشد.");
      return;
    }
  };

  //CreditCard
  const creditCardUpdateHandler = async (
    cardNumber1: string | undefined,
    cardNumberNo2: string | undefined,
    isValidCard1: boolean,
    isValidCard2: boolean
  ) => {
    if (storageUser != null) {
      const data: NumberCard = {
        id: storageUser!.Id,
        cardNumber1,
        cardNumberNo2,
      };

      if (data.cardNumber1) {
        if (data.cardNumber1?.length! < 16 || isValidCard1 === false) {
          toast.error("شماره کارت اول درست نیست");
          return;
        }
      }

      if (data.cardNumberNo2) {
        if (data.cardNumberNo2?.length! < 16 || isValidCard2 === false) {
          toast.error("شماره کارت دوم درست نیست");
          return;
        }
      } else if (
        data.cardNumber1?.length! > 0 &&
        data.cardNumberNo2?.length! > 0 &&
        data.cardNumber1 === data.cardNumberNo2
      ) {
        toast.error("شماره کارت تکراری است");
        return;
      }
      const res: IResult = await service.creditCardsUpdate(data);
      if (res.Error != null) {
        toast.error("تغییرات ثبت نشد.");
        return;
      }
      toast.success("تغییرات اعمال شد.");
    }
  };

  const walletFiller = async (userId: string) => {
    const res: IResult = await service.getWalletBalance(userId);
    setCredit(res.Data);
  };

  //Disability
  //Email
  //bio
  const ClickUpdateMore = async (
    region: string[] | null,
    disability: number[],
    emailAddress: string,
    bio: string
  ) => {
    const UpdateMoreInformation: MoreInformation = {
      id: storageUser?.Id,
      region,
      disability,
      emailAddress,
      bio,
    };

    const res1: IResult = await service.bioUpdate(UpdateMoreInformation);
    const res2: IResult = await service.disabilityUpdate(UpdateMoreInformation);
    const res3: IResult = await service.emailUpdate(UpdateMoreInformation);
    const res4: IResult = await service.regionUpdate(UpdateMoreInformation);
    if (
      res1.Error != null ||
      res2.Error != null ||
      res3.Error != null ||
      res4.Error != null
    ) {
      toast.error("تغییرات اعمال نشد.");
      return;
    }
    toast.success("تغییرات اعمال شد.");
  };

  const callBackToUserInfo = async (user: IuserInfor) => {
    const userInfo: IinfoUser = {
      userId: storageUser.Id,
      firstName: user.firstName,
      lastName: user.lastName,
      birthDay: user.birthDay,
      gender: user.gender,
      nationalCode: user.nationalCode,
    };

    storageUser.FirstName = userInfo.firstName;
    storageUser.LastName = userInfo.lastName;
    addLocalStorage(JSON.stringify(storageUser), "user");

    const res = await service.putUpdateUserInfo(userInfo);

    if (res.Data) {
      toast.success("تغییرات اعمال شد.");
      personalInformation(storageUser!.Id);
    }
  };

  return (
    <>
      {person && (
        <>
          <ScoreUser
            rejectedPicture={rejectedPicture}
            verifiedPictureUser={verifiedPicture}
            img={img}
            upsertImgRef={upsertImgRef}
            onUploadingImg={onUploadingImg}
            onUpsertImgClicked={() => {
              setImgRef(false);
              addImgOkHandler();
            }}
            OpenRemoveImg={RemovePhoto}
            clientScores={clientScoreDetail}
            servantScores={servantScore}
            personalData={person}
          />
          <PersonalInformation
            personInformationData={person}
            callBackToUserInfo={callBackToUserInfo}
          />
          {skillCatOptions && (
            <Skill
              personalData={person}
              UpdateCreditCards={(
                serviceCategoryIds: string[] | undefined,
                skill: string | undefined
              ) => {
                trackPromise(skillsUpdateHandler(serviceCategoryIds, skill));
              }}
              skillCatOptions={skillCatOptions}
            />
          )}
          <AccountInformation
            personalData={person}
            credit={credit}
            creditCardUpdateHandler={(
              cardNumber1: string | undefined,
              cardNumberNo2: string | undefined,
              isValidCard1: boolean,
              isValidCard2: boolean
            ) => {
              trackPromise(
                creditCardUpdateHandler(
                  cardNumber1,
                  cardNumberNo2,
                  isValidCard1,
                  isValidCard2
                )
              );
            }}
          />
          <MoreInformationField
            personalData={person}
            UpdateMore={(
              region: string[] | null,
              disability: number[],
              emailAddress: string,
              bio: string
            ) => {
              trackPromise(
                ClickUpdateMore(region, disability, emailAddress, bio)
              );
            }}
          />
        </>
      )}
    </>
  );
}
export default Profile;
