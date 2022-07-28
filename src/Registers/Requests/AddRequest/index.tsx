import { useState, useEffect, useRef } from "react";
import ModeSwitcher from "../../../Components/ModeSwitcher";
import Paper from "../../../Components/Paper";
import Button from "../../../Components/Button";
import TimeRegisterPopup from "./Components/TimeRegisterPopup";
import DetailsRegisterPopup from "./Components/DetailsRegisterPopup";
import LocationPopup from "./Components/LocationPopup";
import Select from "../../../Components/Inputs/SingleSearchDropDown";
import { IRegisterSave, IValidationSave, Priority } from "./Entities";
import {
  RequestType,
  PresenceTypeCategory,
  FileType,
} from "../../../Models/Enums";
import * as service from "./Service";
import "../index.scss";
import { IdropDownModel } from "../../../Components/Inputs/DropDown";
import { useHistory } from "react-router-dom";
import { ILocation } from "../../../Components/Maps/Entities";
import { TextField } from "@material-ui/core";
import locationIcon from "../../../Images/addRequest/locationIcon.svg";
import timeIcon from "../../../Images/addRequest/timeIcon.svg";
import detailsIcon from "../../../Images/addRequest/detailsIcon.svg";
import { Formik, Field, Form } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { IResult } from "../../../Services/Entities";
import {
  toEnglishNumber,
  toPersianCurrency,
  toPersianNumber,
} from "../../../Components/hooks/persianHelper";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { IEditFile } from "../../../Components/FileUploader";
import { showLocalStorage } from "../../../Routers/localStorage";
import { useGeneralContext } from "../../../Providers/GeneralContext";
import { validateTitelAddRequest } from "../../../Components/hooks/Validations";
import { postGetAuthorityForPayment } from "../../../Wallet/IncreaseWallet/IService";
import useSignalR from "../../../Components/hooks/useSignalR";
import { RequestRegistration } from "../../../config";
import { IPayBank } from "../../../Models/Entities";
import { trackPromise } from "react-promise-tracker";

const audioFormats = ["mp3", "wma", "m4a"];
const imageFormats = ["jpeg", "png", "gif", "jpg", "bmp"];
const videoFormats = ["mkv", "mp4", "3gp"];
const docFormats = ["doc", "docx", "xls", "xlsx", "rtf", "txt", "pdf"];

const msg6 = "عکس پروفایل شما تایید و یا ثبت نشده است";

function AddRequest() {
  const matchesSm = useMediaQuery("(max-width:40rem)");
  const storageUser = showLocalStorage("user");
  const { onConfirmSetter, setConfirmPopupOpen } = useGeneralContext();
  // const buttonRef = useRef(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [CfgBeginWorkDateDeadline, setCfgBeginWorkDateDeadline] = useState();
  const [activityDurationNormal, setActivityDurationNormal] = useState(0);
  const [activityDurationEmergency, setActivityDurationEmergency] = useState(0);
  const [fileSize, setFileSize] = useState(0);
  const [fileCount, setFileCount] = useState(0);

  const history = useHistory();

  const [requestType, setRequestType] = useState<RequestType>(
    RequestType.Normal
  );
  const [mapOpen, setMapOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [detailesOpen, setdetailesOpen] = useState(false);

  //messages
  // const msg8 =
  //   "شما یک درخواست فوری تسویه نشده دارید, ابتدا باید آن را تسویه نمایید, آیا می خواهید هم اکنون کیف پول را شارژ نمایید؟";

  const msg4 =
    "موجودی کافی نمی باشد اما به دلیل فوری بودن درخواست می توانید بعد از انجام کار پرداخت نمایید. آیا می خواهید هم اکنون کیف پول را شارژ کنید؟";
  const msgFailed = "عملیات با خطا مواجه شد";
  const msg11 = "لطفا استان محل خدمت را وارد کنید.";

  //base
  const [categories, setCategories] = useState<IdropDownModel[]>([]);
  const [category, setCategory] = useState<IdropDownModel>();
  const [presence, setPresence] = useState(PresenceTypeCategory.Presence);

  //map
  const [userRegions, setUserRegions] = useState<string[]>([]);
  const [stateId, setStateId] = useState<string | null>("");
  const [cityId, setCityId] = useState<string | null>("");
  const [regionId, setRegionId] = useState<string | null>("");
  const [regions, setRegions] = useState<string[] | null>([]);

  const [location, setLocation] = useState<ILocation | null>(null);
  //time
  const [date, setDate] = useState<Date | null | undefined>();
  const [time, setTime] = useState<string | null | undefined>();
  //details
  const [hour, setHour] = useState<number | undefined>();
  const [details, setDetails] = useState("");
  const [fileList, setFileList] = useState<IEditFile[]>([]);

  // const [saveData, setSaveData] = useState<IRegisterSave | undefined>();

  const connectionInstanceMaker = useSignalR();
  const [connection, setConnection] = useState<signalR.HubConnection>();
  const [isConnected, setIsConnected] = useState(false);
  const saveData = useRef<IRegisterSave>();

  useEffect(() => {
    onConnectionInstanceResolved();
    trackPromise(fillUserRegions(storageUser.Id));
    trackPromise(fillCategories());
    trackPromise(config());
  }, []);

  useEffect(() => {
    if (storageUser && isConnected) {
      connection?.on("IsPaySuccess", (isSuccess: boolean) => {
        if (isSuccess && saveData.current) {
          toast.success("پرداخت با موفقیت انجام شد");
          trackPromise(insertRequest(saveData.current));
          return;
        } else {
          setDisableBtn(false);
          toast.error("پرداخت انجام نشد");
          return;
        }
      });
    }
  }, [isConnected]);

  const onConnectionInstanceResolved = async () => {
    if (!connection) {
      const instance = await connectionInstanceMaker(
        storageUser.AccessToken,
        setIsConnected,
        RequestRegistration + "RegistrationHub"
      );
      setConnection(instance);
    }
  };

  //reject
  const onReject = () => {
    history.push("/");
  };

  const fillUserRegions = async (Id: string) => {
    const x: IResult = await service.getUserRegion(Id);

    if (x.Data != null) {
      setUserRegions(x.Data);
      if (
        x.Data[0].id != null &&
        x.Data[1].id != null &&
        x.Data[2].id != null
      ) {
        setStateId(x.Data[0].id);
        setCityId(x.Data[1].id);
        setRegionId(x.Data[2].id);
        setRegions([
          x.Data[0].locationName,
          x.Data[1].locationName,
          x.Data[2].locationName,
        ]);
      } else if (
        x.Data[0].id != null &&
        x.Data[1].id === null &&
        x.Data[2].id === null
      ) {
        setStateId(x.Data[0].id);
        setRegions([x.Data[0].locationName]);
        setCityId(null);
        setRegionId(null);
      } else if (
        x.Data[0].id != null &&
        x.Data[1].id != null &&
        x.Data[2].id === null
      ) {
        setStateId(x.Data[0].id);
        setCityId(x.Data[1].id);
        setRegions([x.Data[0].locationName, x.Data[1].locationName]);
        setRegionId(null);
      } else {
        setRegions(null);
        setStateId(null);
        setCityId(null);
        setRegionId(null);
      }
    }
  };

  const fileLoaded = (fileExtension: string) => {
    let fileType: FileType = FileType.Doc;
    if (docFormats.includes(fileExtension)) fileType = FileType.Doc;
    else if (imageFormats.includes(fileExtension)) fileType = FileType.Image;
    else if (videoFormats.includes(fileExtension)) fileType = FileType.Video;
    else if (audioFormats.includes(fileExtension)) fileType = FileType.Audio;
    return fileType;
  };

  const handleFileChosen = async (file: File) => {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = reject;
    });
  };

  const readAllFiles = async (AllFiles: IEditFile[]) => {
    const results = await Promise.all(
      AllFiles.map(async (file) => {
        const fileContents = await handleFileChosen(file.uploadedFile!);
        return {
          content: fileContents,
          extension: file.name.split(".").pop()!.toLowerCase(),
          fileType: fileLoaded(file.name.split(".").pop()!.toLowerCase()),
          fileSize: file.uploadedFile?.size!,
        };
      })
    );
    return results;
  };

  const checkProfileBeforeSave = async (values: any) => {
    let f: IResult = await service.hasProfileImage(storageUser.Id);
    if (f.Data === false) {
      toast.info(msg6);
    } else {
      checkStateId(values);
    }
  };

  const checkStateId = (values: any) => {
    if (presence === PresenceTypeCategory.Presence) {
      if (stateId === "" || stateId === null || stateId === undefined) {
        toast.info(msg11);
      } else {
        continueSubmit(values);
      }
    } else {
      continueSubmit(values);
    }
  };

  const continueSubmit = async (values: any) => {
    setDisableBtn(true);
    let temp = await readAllFiles(fileList);
    if (values.title !== " ") {
      const validation: IValidationSave = {
        userId: storageUser.Id,
        requestType: requestType,
        expiration: hour
          ? hour
          : requestType === RequestType.Emergency
          ? activityDurationEmergency
          : 1,
      };
      const saveModel: IRegisterSave = {
        requestType: requestType,
        requestCategoryId: category === undefined ? null : category.id,
        expiration: hour
          ? hour
          : requestType === RequestType.Emergency
          ? activityDurationEmergency
          : 1,
        presenceType: presence,
        stateId:
          presence === PresenceTypeCategory.UnPresence
            ? undefined
            : stateId === null
            ? undefined
            : stateId,
        cityId:
          presence === PresenceTypeCategory.UnPresence
            ? undefined
            : cityId === null
            ? undefined
            : cityId,
        regionId:
          presence === PresenceTypeCategory.UnPresence
            ? undefined
            : regionId === null
            ? undefined
            : regionId,
        location:
          presence === PresenceTypeCategory.UnPresence ? null : location,
        fileList: temp!,
        userId: storageUser.Id,
        content: details ? details : null,
        priority: Priority.Normal,
        beginDate: date ? toEnglishNumber(date.toJSON().split("T")[0]) : null,
        beginTime: time ? toEnglishNumber(time) : null,
        title: toEnglishNumber(values.title.trim()),
        locationName: location?.name ? location?.name : null,
      };

      if (saveModel.beginDate) {
        if (new Date().toISOString().split("T")[0] === saveModel.beginDate) {
          let h = Number(new Date().getHours());
          let m;
          if (new Date().getMinutes() <= 9) {
            m = "0" + new Date().getMinutes();
          } else {
            m = new Date().getMinutes();
          }
          if (time) {
            if (h === Number(toEnglishNumber(time?.split(":")[0]))) {
              if (
                m > Number(toEnglishNumber(time?.split(":")[1].split(":")[0]))
              ) {
                toast.info("زمان انجام کار معتبر نمی باشد.");
                return;
              } else {
                afterCheckTime(
                  validation,
                  saveModel,
                  toEnglishNumber(values.title.trim())
                );
                return;
              }
            } else if (h > Number(time?.split(":")[0])) {
              toast.info("زمان انجام کار معتبر نمی باشد.");
              return;
            } else {
              afterCheckTime(
                validation,
                saveModel,
                toEnglishNumber(values.title.trim())
              );
              return;
            }
          } else {
            afterCheckTime(
              validation,
              saveModel,
              toEnglishNumber(values.title.trim())
            );
            return;
          }
        } else if (
          new Date().toISOString().split("T")[0] > saveModel.beginDate
        ) {
          toast.info("زمان انجام کار معتبر نمی باشد.");
          return;
        } else {
          afterCheckTime(
            validation,
            saveModel,
            toEnglishNumber(values.title.trim())
          );
          return;
        }
      } else {
        afterCheckTime(
          validation,
          saveModel,
          toEnglishNumber(values.title.trim())
        );
        return;
      }
    }
    toast.error("عنوان درخواست اشتباه است.");
  };

  const afterCheckTime = async (
    validation: IValidationSave,
    saveModel: IRegisterSave,
    descriptionIncreaseWallet: string
  ) => {
    let z: IResult = await service.balanceValidationRequestRegistration(
      validation
    );
    let amount = z.Data as number;
    const zt: IResult = await service.getAmountForRequest({
      requestType: requestType,
      expiration: hour
        ? hour
        : requestType === RequestType.Emergency
        ? activityDurationEmergency
        : 1,
    });
    let amountForRequest = zt.Data;

    if (amount >= 0) {
      const msg9 = `با ذخیره درخواست مبلغ ${toPersianCurrency(
        amountForRequest
      )} ریال، از حساب شما کسر می شود آیا ادامه می دهید؟`;
      onConfirmSetter(
        msg9,
        () => insertRequest(saveModel),
        () => {
          setDisableBtn(false);
        }
      );
      setConfirmPopupOpen(true);
    } else {
      //normal
      if (requestType === RequestType.Normal) {
        increseAmount(saveModel, Math.abs(amount), descriptionIncreaseWallet);
      } else {
        //emergency
        walletBalance(saveModel, Math.abs(amount), descriptionIncreaseWallet);
      }
    }
  };

  //save
  const onSubmit = async (values: any) => {
    checkProfileBeforeSave(values);
  };

  const walletBalance = async (
    savaModel: any,
    amountBalance: number,
    descriptionIncreaseWallet: string
  ) => {
    const res: IResult = await service.getWalletBalance(storageUser.Id!);
    if (res.Data < 0) {
      increseAmount(savaModel, amountBalance, descriptionIncreaseWallet);
    } else {
      onConfirmSetter(
        msg4,
        async () => {
          const forBank: IPayBank = {
            userId: storageUser.Id,
            amount: amountBalance,
            description: descriptionIncreaseWallet + storageUser.MobileNo,
            callback_url: window.location.href + "?a=" + amountBalance,
          };
          const resBank = await postGetAuthorityForPayment(forBank);

          if (resBank.Error && resBank.Error.Status === 400) {
            toast.error(msgFailed);
            return;
          }
          if (resBank.Data) {
            window.open(`https://www.zarinpal.com/pg/StartPay/${resBank.Data}`);
          }
        },
        () => {
          insertRequest(savaModel);
        }
      );
      setConfirmPopupOpen(true);
    }
  };

  const increseAmount = async (
    saveModel: any,
    amount: number,
    descriptionIncreaseWallet: string
  ) => {
    saveData.current = saveModel;
    const msg2 = `موجودی کافی نمی باشد مبلغ ${toPersianCurrency(
      Math.abs(amount)
    )} ریال، نیاز است شارژ کنید. هم اکنون شارژ می کنید؟`;

    onConfirmSetter(
      msg2,
      async () => {
        const forBank: IPayBank = {
          userId: storageUser.Id,
          amount,
          description: descriptionIncreaseWallet,
          callback_url: window.location.href + "?a=" + amount,
        };
        const resBank = await postGetAuthorityForPayment(forBank);
        if (resBank.Error && resBank.Error.Status === 400) {
          toast.error(msgFailed);
          return;
        }
        if (resBank.Data) {
          window.open(`https://www.zarinpal.com/pg/StartPay/${resBank.Data}`);
        }
      },
      () => {
        setDisableBtn(false);
      }
    );
    setConfirmPopupOpen(true);
  };

  const insertRequest = async (save: IRegisterSave) => {
    const res: IResult = await service.insertRequestRegistration(save);

    if (res.Status == 200) {
      toast.success(
        "درخواست با موفقیت ثبت شد تا دقایقی دیگر درخواست شما در لیست درخواستها قابل مشاهده خواهد بود"
      );
    } else {
      toast.error("ثبت درخواست با مشکل مواجه شد با پشتیبانی تماس بگیرید");
    }
    history.push("/");
  };

  // emergency or normal request
  const estimatedTimeToEmergencyRequest = async () => {
    if (requestType === 1) {
      setRequestType(RequestType.Normal);
      return;
    }
    let time: IResult = await service.getEstimatedTimeToEmergencyRequest(
      storageUser.Id
    );
    if (time.Data <= 0) {
      setRequestType(RequestType.Emergency);
    } else {
      toast.error(
        "شما اجازه ثبت درخواست فوری را تا " +
          `${toPersianNumber(time.Data)}` +
          " روز دیگر ندارید."
      );
      setRequestType(RequestType.Normal);
    }
  };

  //fillCategory
  const fillCategories = async () => {
    let x: IResult = await service.getCategories();
    setCategories(x.Data as IdropDownModel[]);
  };

  const config = async () => {
    let x: IResult = await service.getConfigs();
    setCfgBeginWorkDateDeadline(x.Data.cfgBeginWorkDateDeadline);
    //activityDuration  normal/emergency
    setActivityDurationEmergency(
      x.Data.cfgRequestRegistrationEmergencyActivityDuration
    );
    setActivityDurationNormal(
      x.Data.cfgRequestRegistrationNormalActivityDuration
    );

    //uploadFileSize
    setFileSize(x.Data.cfgRequestRegistrationFileVolumeSize);
    setFileCount(x.Data.cfgRequestRegistrationFileCount);
  };

  const initialValues = {
    title: "",
  };

  const validationSchema = yup.object().shape({
    title: yup.string().required("عنوان درخواست الزامی است"),
  });

  const mapClicked = async () => {
    setMapOpen(true);
  };

  const timeClicked = () => {
    setTimeOpen(true);
  };

  const detailesClicked = () => {
    setdetailesOpen(true);
  };

  const requestTypeIconClicked = () => {
    estimatedTimeToEmergencyRequest();
  };

  const dateTimeDisplayer = (
    date: Date | undefined | null,
    time: string | undefined | null
  ) => {
    let faDate;
    let faTime;
    if (date) faDate = toPersianNumber(date?.toLocaleDateString("fa-IR"));
    if (time) faTime = toPersianNumber(time);

    let dateTime = "";
    if (faTime) {
      dateTime = faTime;

      if (faDate) {
        dateTime += ` - ${faDate}`;
      }
    } else if (faDate) {
      dateTime = faDate;
    }
    if (dateTime) return dateTime;

    return "تعیین نشده";
  };

  const regionDisplayer = (region: string[] | undefined[] | null) => {
    if (region) {
      if (region[0]) {
        if (region[1]) {
          if (region[2]) {
            return `${region[0]} - ${region[1]} - ${region[2]}`;
          } else return `${region[0]} - ${region[1]}`;
        } else return `${region[0]}`;
      }
    }
    return "تعیین نشده";
  };

  const PresenceHandler = (isChecked: boolean) => {
    if (isChecked) {
      setPresence(PresenceTypeCategory.Presence);
    } else {
      setPresence(PresenceTypeCategory.UnPresence);
    }
  };

  const reqTypeHandler = (isChecked: boolean) => {
    if (isChecked) {
      setRequestType(RequestType.Normal);
    } else {
      setRequestType(RequestType.Emergency);
      requestTypeIconClicked();
    }
    setHour(undefined);
  };

  const view = () => {
    return (
      <>
        <header className="upsert-header-btns-wrapper">
          <div className="upsert-header-btn">
            <img
              alt=""
              style={{
                opacity: presence === 0 ? 1 : 0.5,
              }}
              src={locationIcon}
              onClick={presence === 0 ? mapClicked : () => {}}
            />
          </div>
          <div className="upsert-header-btn">
            <img alt="" src={detailsIcon} onClick={detailesClicked} />
          </div>
          <div className="upsert-header-btn">
            <img
              alt=""
              style={{
                opacity: requestType === 0 ? 1 : 0.5,
              }}
              src={timeIcon}
              onClick={requestType === 0 ? timeClicked : () => {}}
            />
          </div>
        </header>
        <Paper className="upsert-paper">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {(props) => (
              <Form noValidate className="upsert-form">
                <div className="upsert-form-data-wrapper">
                  <div className="upsert-fields-grid-container">
                    <div className="upsert-fields-grid-item-1">
                      <Field
                        as={TextField}
                        validate={validateTitelAddRequest}
                        value={toPersianNumber(props.values.title)}
                        label="عنوان درخواست"
                        name="title"
                        variant="standard"
                        size="small"
                        onChange={(c: any) => {
                          let title = c.target.value;
                          if (c.target.value.length <= 55) {
                            c.target.value = c.target.value.replace(
                              /\s+/g,
                              " "
                            );
                            props.handleChange(c);
                          }
                        }}
                        error={props.errors.title && props.touched.title}
                        fullWidth
                        helperText={
                          props.errors.title
                            ? props.errors.title
                            : "عنوان درخواست خود را بیان کنید"
                        }
                      />
                    </div>
                    <div className="upsert-fields-grid-item-2">
                      <Select
                        label="دسته بندی"
                        value={category}
                        setValue={setCategory}
                        options={categories}
                        helperText="جهت تسریع در پذبرش درخواست لطفا دسته بندی مورد نظر را مشخص نمایید"
                      />
                    </div>
                  </div>
                  <div className="upsert-request-details-wrapper">
                    <div className="upsert-request-details-item">
                      <ModeSwitcher
                        rightLabel="حضوری"
                        leftLabel="غیر حضوری"
                        checked={presence === PresenceTypeCategory.Presence}
                        onChecked={PresenceHandler}
                      />
                      <ModeSwitcher
                        rightLabel="عادی"
                        leftLabel="فوری"
                        checked={requestType === RequestType.Normal}
                        onChecked={reqTypeHandler}
                      />
                    </div>
                    <div className="upsert-request-details-item">
                      <div>
                        <label>تاریخ و زمان انجام:</label>
                        <span dir="ltr">
                          {requestType === RequestType.Normal
                            ? dateTimeDisplayer(date, time)
                            : "---"}
                        </span>
                      </div>
                      <div>
                        <label>محل انجام:</label>
                        {presence === PresenceTypeCategory.UnPresence
                          ? "---"
                          : toPersianNumber(regionDisplayer(regions))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="upsert-btns-grid-container">
                  <Button
                    label="ثبت"
                    submit
                    className="upsert-btn-grid-item-1"
                    size={matchesSm ? "sm" : "lg"}
                    disabled={disableBtn}
                  />
                  <Button
                    label="انصراف"
                    onClick={onReject}
                    className="upsert-btn-grid-item-2"
                    size={matchesSm ? "sm" : "lg"}
                    variant="outlined"
                    color="red"
                    disabled={disableBtn}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </Paper>
        <DetailsRegisterPopup
          hour={hour}
          details={details}
          fileSize={fileSize}
          activityDurationEmergency={activityDurationEmergency}
          activityDurationNormal={activityDurationNormal}
          fileCount={fileCount}
          files={fileList}
          onConfirm={(s) => {
            setHour(s.hour);
            setDetails(s.details);
            setFileList(s.fileList);
            setdetailesOpen(false);
          }}
          requestType={requestType}
          handleClose={() => {
            setdetailesOpen(false);
          }}
          open={detailesOpen}
          onClose={() => {
            setdetailesOpen(false);
          }}
        />
        <TimeRegisterPopup
          date={date}
          time={time}
          CfgBeginWorkDateDeadline={CfgBeginWorkDateDeadline!}
          onConfirm={(s) => {
            setDate(s.date);
            setTime(s.time);
            setTimeOpen(false);
          }}
          handleClose={() => {
            setTimeOpen(false);
          }}
          open={timeOpen}
          onClose={() => {
            setTimeOpen(false);
          }}
        />
        {userRegions && (
          <LocationPopup
            currentState={stateId!}
            currentCity={cityId!}
            currentRegion={regionId!}
            currentLocation={location!}
            onConfirm={(s) => {
              if (s.state === "" && s.city === "" && s.region === "") {
                setStateId(null);
                setCityId(null);
                setRegionId(null);
              } else if (s.state != "" && s.city === "" && s.region === "") {
                setStateId(s.state);
                setCityId(null);
                setRegionId(null);
              } else if (s.state != "" && s.city != "" && s.region === "") {
                setStateId(s.state);
                setCityId(s.city);
                setRegionId(null);
              } else {
                setStateId(s.state);
                setCityId(s.city);
                setRegionId(s.region);
              }
              setLocation(s.location);
              setMapOpen(false);
              setRegions(s.regionNames);
            }}
            open={mapOpen}
            onClose={() => {
              setMapOpen(false);
            }}
          />
        )}
      </>
    );
  };

  return <>{view()}</>;
}

export default AddRequest;
