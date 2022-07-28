import { useState, useEffect, useRef } from "react";
import SimpleBar from "simplebar-react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Switch from "@material-ui/core/Switch";
import { useHistory } from "react-router";
import moment from "moment";
import { toast } from "react-toastify";
import "./index.scss";
import { IPayBank } from "../../../Models/Entities";
import { PresenceTypeCategory } from "../../../Models/Enums";
import * as service from "../../IService";
import Paper from "../../../Components/Paper";
import Button from "../../../Components/Button";
import Popup from "../../../Components/Popup";
import { concatDateAndTimeInString } from "../../../Components/DateTimePicker/dateHelper";
import {
  toPersianNumber,
  toPersianCurrency,
  toEnglishNumber,
} from "../../../Components/hooks/persianHelper";
import { IUserLogin } from "../../../Providers/Entities";
import {
  IInfoGlobalConfigs,
  IMobileNos,
  IRequestDetails,
  UserInfoSummary,
} from "../../Entities";
import { useGeneralContext } from "../../../Providers/GeneralContext";
import { IResult } from "../../../Services/Entities";
import TimePickerCustome from "../../../Components/DateTimePicker/TimePickerPersian";
import DatePickerCustome from "../../../Components/DateTimePicker/DatePickerPersian";
import { showLocalStorage } from "../../../Routers/localStorage";
// import { trackPromise } from "react-promise-tracker";

const msg1 = (
  dueDate: string,
  dueTime: string,
  price: string,
  cancelPrice: string
) =>
  `درخواست دهنده شروع کار توسط شما را در زمان ${dueTime} و تاریخ ${dueDate} تایید کرده است، در صورت تایید توسط شما مبلغ ${price} ریال از کیف پول شما کسر می گردد که مقدار ${cancelPrice} ریال بابت حق فسخ بوده و پس از پایان درخواست به حساب شما برگردانده می شود، شما متعهد به انجام کار در زمان اعلام شده هستید. آیا انجام کار را تایید می کنید؟`;
const msg2 = (fullName: string) => `${fullName} درخواست را لغو نموده است.`;
const msg3 = "آیا مطمئن هستید که شماره موبایل برای طرف مقابل نمایش داده شود؟";
const msg4 =
  "جهت بهبود کیفیت خدمات و تضمین امنیت، بهتر است محل خدمت تنظیم شود.";
const msg6 = (fullName: string) =>
  `${fullName} محل خدمت را به روز رسانی کرده است، لطفا آن را بررسی نمایید.`;
const msg7 = (fullName: string) =>
  `${fullName} انجام کار با شرایط اعلام شده را تایید نکرده است.`;
const msg8 = "موجودی کافی نمی باشد، هم اکنون شارژ می کنید؟";
const msg9 = (fullName: string) =>
  `${fullName} انجام کار با شرایط  اعلام شده را رد کرده است.`;
const msg10 = "آیا از ادامه کار با این همیار منصرف شده اید؟";
const msg11 =
  "آیا از انجام این کار منصرف شده اید، در صورت انصراف نمی توانید این کار را مجدد پذیرش کنید.";
const msg12 = "آیا مطمئن هستید که شماره موبایل برای طرف مقابل نمایش داده نشود؟";
const msg13 = "درخواست قابل پذیرش نمی باشد.";
const msg14 = "درخواست قابل تایید نمی باشد.";
const msg16 = "موجودی کافی نمی باشد هم اکنون شارژ می کنید؟";
const msg17 = "عملیات پرداخت ناموفق بود.";
const msg18 = "عکس پروفایل شما ثبت و یا تایید نشده است.";
const msg21 =
  "برای استفاده از این امکان ابتدا باید دکمه شروع گفتگو را کلیک نمایید.";
const paymentFailedMsg = "تراکنش با خطا مواجه شد.";
const servantConfirmMsg =
  "همیار انجام کار با شرایط اعلام شده را تایید نموده است.";
const refuseReqMsg = (fullName: string) =>
  `${fullName} درخواست را لغو نموده است.`;

interface timeDateValid {
  time: string;
  date: string;
}

type Props = {
  receiverId: string;
  isClient: boolean;
  requestConfirmId: string;
  connection: signalR.HubConnection;
  userLogin: IUserLogin;
  infoGlobalConfigs: IInfoGlobalConfigs;
  reqRegistrationId: string;
  clientId: string;
  servantId: string;
  setChatDisable: (disable: boolean) => void;
  mobileNos: IMobileNos;
  shouldDisabled: boolean | undefined;
  reqRegistrationInfo: IRequestDetails;
  deadline: number;
  init: () => void;
  getReqConfirmHeaderData: (data: Object) => void;
  userInfo: UserInfoSummary | undefined;
  stateName: null | string;
  cityName: null | string;
  regionName: null | string;
  getRequestLocationInfo: () => void;
};

function InfoAndActions({
  receiverId,
  isClient,
  requestConfirmId,
  connection,
  userLogin,
  infoGlobalConfigs,
  reqRegistrationId,
  clientId,
  servantId,
  setChatDisable,
  mobileNos,
  shouldDisabled,
  reqRegistrationInfo,
  deadline,
  init,
  getReqConfirmHeaderData,
  userInfo,
  stateName,
  cityName,
  regionName,
  getRequestLocationInfo,
}: Props) {
  const storageUser = showLocalStorage("user");
  const matchesSm = useMediaQuery("(max-width:40rem)");
  const history = useHistory();
  const { onConfirmSetter, setConfirmPopupOpen } = useGeneralContext();
  const [showFinalConfirmPopup, setShowFinalConfirmPopup] = useState(false);
  const [date, setDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(moment());
  const [showMobileNo, setShowMobileNo] = useState(false);
  const [servantMobileNo, setServantMobileNo] = useState<null | string>("");
  const [clientMobileNo, setClientMobileNo] = useState<null | string>("");
  const [isDisabled, setIsDisabled] = useState(shouldDisabled);
  const [isRefused, setIsRefused] = useState(false);
  const timeDateValid = useRef<timeDateValid>();
  const localReqId = useRef<string | undefined>();
  const localClientId = useRef<string | undefined>();
  const localServantId = useRef<string | undefined>();

  useEffect(() => {
    if (shouldDisabled === true) {
      if (!isClient) {
        setIsDisabled(true);
        setChatDisable(true);
      }
    } else {
      setIsDisabled(false);
    }
  }, [shouldDisabled]);

  useEffect(() => {
    if (
      requestConfirmId === null ||
      requestConfirmId === "" ||
      requestConfirmId === undefined
    )
      return;
    localReqId.current = requestConfirmId;
  }, [requestConfirmId]);

  useEffect(() => {
    localServantId.current = servantId;
  }, [servantId]);

  useEffect(() => {
    if (clientId === "") return;
    localClientId.current = clientId;

    const { clientNo, servantNo } = mobileNos;
    if ((isClient && clientNo) || (!isClient && servantNo)) {
      setShowMobileNo(true);
    }
    setClientMobileNo(clientNo);
    setServantMobileNo(servantNo);
  }, [clientId]);

  useEffect(() => {
    connection?.on(
      "IsPaySuccess",
      (isSuccess: boolean, BackFormFunction: boolean) => {
        if (isSuccess === true) {
          if (BackFormFunction) {
            toast.success("پرداخت با موفقیت انجام شد");
            accept();
            return;
          } else {
            if (timeDateValid.current) {
              toast.success("پرداخت با موفقیت انجام شد");
              done(timeDateValid.current.date, timeDateValid.current.time);
              return;
            }
          }
        } else if (isSuccess === false) {
          toast.error("پرداخت انجام نشد");
          return;
        }
      }
    );
  }, []);

  useEffect(() => {
    connection?.on(
      "ServantMobileNo",
      (requestConfirmId: string, mobileNo: any) => {
        if (localReqId.current !== requestConfirmId) return;
        setServantMobileNo(mobileNo);
      }
    );

    connection?.on(
      "ClientMobileNo",
      (requestConfirmId: string, mobileNo: any) => {
        if (localReqId.current !== requestConfirmId) return;
        setClientMobileNo(mobileNo);
      }
    );

    connection?.on(
      "FinalConfirm",
      async (reqConfirmId, date, time, showDate) => {
        if (localReqId.current !== reqConfirmId) return;
        setShowFinalConfirmPopup(false);
        const timeDateValidate: timeDateValid = {
          time,
          date,
        };

        timeDateValid.current = timeDateValidate;

        const res = await service.getConfig();

        onConfirmSetter(
          msg1(
            toPersianNumber(showDate),
            toPersianNumber(time),
            toPersianCurrency(
              res.Data.cfgRequestRegistrationCancelPrice +
                res.Data.cfgRequestRegistrationPrice
            ),
            toPersianCurrency(res.Data.cfgRequestRegistrationCancelPrice)
          ),
          () => onConfirmRequest(date, time),
          onRejectRequest
        );
        setConfirmPopupOpen(true);
      }
    );

    connection?.on("RefuseConfirm", (reqConfirmId, userName) => {
      if (localReqId.current !== reqConfirmId) return;
      toast.warning(msg7(userName));
    });

    connection?.on("ConfirmRequest", (reqConfirmId) => {
      if (localReqId.current !== reqConfirmId) return;
      toast.info(servantConfirmMsg);
    });

    connection?.on("Disable", (reqConfirmId) => {
      if (localReqId.current !== reqConfirmId) return;
      setChatDisable(true);
      setIsRefused(true);
    });

    connection?.on("Done", (reqConfirmId) => {
      if (localReqId.current !== reqConfirmId) return;
      history.replace("/");
      setConfirmPopupOpen(false);
      connection!.stop().catch(console.log);
      history.push(`/WaitingToArrived/${localReqId.current}`);
    });

    connection?.on("UpdateLocation", (requRegistrationId, userName) => {
      if (reqRegistrationId !== requRegistrationId) return;
      getRequestLocationInfo();
      toast.info(msg6(userName));
    });
  }, []);

  useEffect(() => {
    if (userInfo === undefined) return;
    const { firstName, lastName } = userInfo;
    connection?.on("RequestConfirmed", (data: any) => {
      if (reqRegistrationId === data) {
        if (
          window.location.pathname.includes("/requestconfirm/C/") ||
          window.location.pathname.includes("/requestconfirm/R/")
        ) {
          history.push("/");
        }
        toast.warning(refuseReqMsg(firstName + " " + lastName));
      }
    });

    connection?.on("RefusePay", (reqConfirmId) => {
      if (localReqId.current === reqConfirmId)
        toast.info(" همیار انجام کار با شرایط اعلام شده را تایید نکرده است.");
      history.push("/");
    });

    connection?.on("RefusedByServant", (reqConfirmId, userName) => {
      if (localReqId.current !== reqConfirmId) return;
      if (
        window.location.pathname.includes("/requestconfirm/C/") ||
        window.location.pathname.includes("/requestconfirm/R/")
      ) {
        history.push("/");
      }
      toast.warning(msg9(userName));
      setConfirmPopupOpen(false);
    });

    connection?.on("RefusedByClient", (reqConfirmId, userName) => {
      if (localReqId.current !== reqConfirmId) return;
      if (
        window.location.pathname.includes("/requestconfirm/C/") ||
        window.location.pathname.includes("/requestconfirm/R/")
      ) {
        history.push("/");
      }
      toast.warning(msg2(userName));
      setConfirmPopupOpen(false);
    });
  }, [userInfo]);

  //TODO: Refactor Needed: This is a cb for passing required data to header of the container component
  useEffect(() => {
    getReqConfirmHeaderData({
      isRefused,
      isDisabled,
      clientMobileNo,
      servantMobileNo,
      msg21,
    });
  }, [clientMobileNo, servantMobileNo, isRefused, isDisabled]);

  const mobileNoDisplayHandler = () => {
    if (isDisabled) {
      toast.info(msg21);
    }
    if (!showMobileNo) {
      onConfirmSetter(msg3, () => displayNoForOther(true));
      setConfirmPopupOpen(true);
    } else {
      onConfirmSetter(msg12, () => displayNoForOther(false));
      setConfirmPopupOpen(true);
    }
  };

  const displayNoForOther = (isPermitted: boolean) => {
    if (isClient) {
      connection
        ?.invoke(
          "ShowMobileNoForServant",
          localReqId.current,
          localServantId.current,
          isPermitted
        )
        .catch((e: any) => {
          //console.log(e);
        });
    } else {
      connection
        ?.invoke(
          "ShowMobileNoForClient",
          localReqId.current,
          localClientId.current,
          isPermitted
        )
        .catch((e: any) => {
          //console.log(e);
        });
    }
    setShowMobileNo(isPermitted);
  };

  const hasReqRegistrationLocation = async (reqRegistrationId: string) => {
    const data: IResult = await service.hasRequestRegistrationLocation(
      reqRegistrationId
    );
    if (data.Error) return;
    if (!data.Data) {
      if (reqRegistrationInfo.presenceType === PresenceTypeCategory.Presence)
        toast.warning(msg4);
    }
    setShowFinalConfirmPopup(true);
  };

  const beginDateAndTimeSupplier = async (reqRegistrationId: string) => {
    // data: { beginDate, beginTime }
    const data: IResult = await service.getRequestBeginDateTime(
      reqRegistrationId
    );
    if (new Date(data.Data.beginDate) < new Date()) {
      let timeHour = new Date().getHours();
      let timeMin;
      if (new Date().getMinutes() <= 9) {
        timeMin = "0" + new Date().getMinutes();
      } else {
        timeMin = new Date().getMinutes();
      }
      setDate(new Date());
      setCurrentTime(moment().hour(Number(timeHour)).minute(Number(timeMin)));
    } else {
      setDate(new Date(data.Data.beginDate));
      const houtTime = data.Data.beginTime.split(":")[0];
      const minutesTime = data.Data.beginTime.split(":")[1];
      setCurrentTime(moment().hour(houtTime).minutes(minutesTime));
    }
    hasReqRegistrationLocation(reqRegistrationId);
  };

  const setTimeSelected = () => {
    beginDateAndTimeSupplier(reqRegistrationId);
  };

  const onFinalConfirm = () => {
    let dateFormat = moment(date).format("YYYY-MM-DD");
    let NowFormat = moment(new Date()).format("YYYY-MM-DD");
    const validDate = moment(NowFormat)
      .add(deadline, "days")
      .format("YYYY-MM-DD");
    const isAfter = moment(dateFormat).isAfter(validDate, "day");

    //todo
    if (dateFormat < NowFormat) {
      toast.error("زمان انجام کار معتبر نمی باشد.");
      return;
    } else if (isAfter) {
      toast.error(
        ` تاریخ  زمان انجام کار نمیتواند بعد از   ${toPersianNumber(
          deadline
        )}  روز دیگر باشد`
      );
      return;
    }
    if (currentTime && dateFormat) {
      if (dateFormat === NowFormat) {
        if (Number(currentTime.hour()) === new Date().getHours()) {
          if (Number(currentTime.minutes()) < new Date().getMinutes()) {
            toast.error("زمان انجام کار معتبر نمی باشد.");
            return;
          }
        } else if (Number(currentTime.hour()) < new Date().getHours()) {
          toast.error("زمان انجام کار معتبر نمی باشد.");
          return;
        }
      }
    }
    connection
      ?.invoke(
        "FinalConfirm",
        localReqId.current,
        localServantId.current,
        date.toISOString(),
        toEnglishNumber(currentTime.format("HH:mm"))
      )
      .then((res) => {
        if (res === false) {
          toast.error("زمان انجام کار معتبر نمی باشد.");
          return;
        }
      })
      .catch((e: any) => {
        //console.log(e);
      });
    setShowFinalConfirmPopup(false);
    // }
  };

  const done = (date: string, time: string) => {
    const finalConfirmDate = concatDateAndTimeInString(date, time);
    const data = {
      requestConfirmId: localReqId.current,
      requestRegistrationId: reqRegistrationId,
      requestUserId: localClientId.current,
      servantUserId: localServantId.current,
      estimatedStartWorkDate: finalConfirmDate,
    };
    connection
      ?.invoke("ConfirmRequest", data)
      .catch((e: any) => {
        // console.log(e);
      })
      .then((d) => {
        if (d == false) {
          toast.error(msg14);
        }
      });
  };

  const onConfirmRequest = async (date: string, time: string) => {
    let r = await service.isInvalidOperation(reqRegistrationId);
    if (r.Data === true) {
      toast.info(msg14);
      history.push("/");
    }
    if (r.Data === false) {
      onConfirmRequestFinal(date, time);
    }
  };

  const onConfirmRequestFinal = async (date: string, time: string) => {
    const data: IResult = await service.getAmount(localServantId.current!);
    if (data.Data < 0) {
      let amount = data.Data;
      onConfirmSetter(
        msg8,
        () => payHandler(amount, false),
        () => refusePay()
      );
      setConfirmPopupOpen(true);
    } else {
      done(date, time);
    }
  };

  const refusePay = () => {
    connection?.invoke("RefusePay", localReqId.current).catch((e: any) => {
      //console.log(e);
    });
  };

  //TODO: For test purposes!
  const payHandler = async (amount: number, backFormFunction: boolean) => {
    const forBank: IPayBank = {
      userId: storageUser.Id,
      amount: Math.abs(amount),
      callback_url:
        window.location.href +
        "?a=" +
        Math.abs(amount) +
        "&RequestRegistrationId=" +
        reqRegistrationId +
        "&backFormFunction=" +
        backFormFunction,
      description: `تایید درخواست ${storageUser.MobileNo}`,
    };
    const resBank = await service.postGetAuthorityForPayment(forBank);
    if (resBank.Error && resBank.Error.Status === 400) {
      toast.error(paymentFailedMsg);
      return;
    }
    if (resBank.Data) {
      window.open(`https://www.zarinpal.com/pg/StartPay/${resBank.Data}`);
    }
    // const res = await service.pay(data, isPaySuccessFul);
    // if (res.Data) {
    //   done(date, time);
    // } else {
    //   toast.error(paymentFailedMsg);
    // }
  };

  const onRejectRequest = () => {
    const hubNotification = {
      userId: localClientId.current,
      SenderUserId: userLogin?.Id,
      SenderUserName: userLogin.FirstName + " " + userLogin.LastName,
    };
    connection
      ?.invoke("RefuseConfirm", localReqId.current, hubNotification)
      .catch((e: any) => {
        //console.log(e);
      });
  };

  // const payStartTalking = async (isSuccessFul: boolean, amount: number) => {
  //   const data = {
  //     userId: userLogin.Id,
  //     amount: Math.abs(amount),
  //     trackingCode: "12345",
  //     requestRegistrationId: reqRegistrationId,
  //     walletOperation: WalletOperation.InputForAcceptRequest,
  //   };

  //   const result: IResult = await service.pay(data, isSuccessFul);
  //   return result.Data;
  // };

  const preprocsses = async () => {
    let r = await service.isInvalidOperation(reqRegistrationId);
    if (r.Data === true) {
      toast.info(msg13);
      history.push("/");
    }
    if (r.Data === false) {
      profileImage();
    }
  };

  const profileImage = async () => {
    const res = await service.getCheckProfile(userLogin.Id);
    if (res.Data === true) {
      checkAmount();
    } else {
      toast.error(msg18);
    }
  };

  const checkAmount = async () => {
    let response = await service.getAmount(userLogin.Id);
    if (response.Data < 0) {
      onConfirmSetter(
        msg16,
        //   async () => {
        //   const result = await payStartTalking(true, response.Data);
        //   accept(result);
        // }
        () => payHandler(response.Data, true)
      );
      setConfirmPopupOpen(true);
    } else accept();
  };

  const accept = async () => {
    const res = await service.insertRequestConfirm({
      requestRegistrationId: reqRegistrationId,
      servantUserId: userLogin.Id,
    });
    if (res.Error !== null) return;
    if (res.Data === null) {
      toast.error(msg13);
    } else {
      setIsDisabled(false);
      setChatDisable(false);
    }
    init();
  };

  const onReqRefused = () => {
    const refuseReqModel = {
      requestConfirmId: localReqId.current,
      canceledUserId: userLogin?.Id,
    };

    const hubNotification = {
      userId: isClient ? localServantId.current : localClientId.current,
      SenderUserId: userLogin?.Id,
      SenderUserName: userLogin.FirstName + " " + userLogin.LastName,
    };
    if (isClient) {
      connection
        ?.invoke("RefuseRequestByClient", refuseReqModel, hubNotification)
        .catch((e: any) => {
          //console.log(e);
        });
    } else {
      connection
        ?.invoke("RefuseRequestByServant", refuseReqModel, hubNotification)
        .catch((e: any) => {
          //console.log(e);
        });
    }
    history.push("/");
  };

  const onTerminatingConfirm = () => {
    onConfirmSetter(isClient ? msg10 : msg11, onReqRefused);
    setConfirmPopupOpen(true);
  };

  return (
    <>
      <Paper
        elevation={2}
        className="chat-complementary-paper req-confirm-paper"
      >
        <Popup
          open={showFinalConfirmPopup}
          onClose={() => setShowFinalConfirmPopup(false)}
          className="req-confirm-dates-popup"
        >
          <div className="req-confirm-dates-wrapper">
            <DatePickerCustome
              label="تاریخ مراجعه"
              datePicker={date}
              onChangeDate={setDate}
              //minDate={new Date()}
            />
            <TimePickerCustome
              label="زمان انجام درخواست"
              timePicker={currentTime}
              onChangetime={setCurrentTime}
            />
          </div>
          <div className="req-confirm-dates-btns-wrapper">
            <Button
              onClick={onFinalConfirm}
              label="تایید"
              size={matchesSm ? "xs" : "sm"}
            />
            {!isDisabled && (
              <Button
                onClick={() => setShowFinalConfirmPopup(false)}
                variant="outlined"
                label="بازگشت"
                size={matchesSm ? "xs" : "sm"}
                color="blue"
              />
            )}
          </div>
        </Popup>
        <div className="req-confirm-detail">
          <p className="req-confirm-detail-title">عنوان درخواست</p>
          <p className="req-confirm-detail-content">
            {toPersianNumber(reqRegistrationInfo.title)}
          </p>
        </div>
        <div className="req-confirm-detail">
          <p className="req-confirm-detail-title">توضیحات</p>
          <SimpleBar
            autoHide={false}
            className="req-confirm-detail-description"
          >
            {reqRegistrationInfo.content}
          </SimpleBar>
        </div>
        {reqRegistrationInfo.presenceType === PresenceTypeCategory.Presence && (
          <div className="req-confirm-detail">
            <p className="req-confirm-detail-title">محل جغرافیایی</p>
            <p className="req-confirm-detail-content">
              {stateName && (
                <>
                  {toPersianNumber(stateName)}
                  {cityName && (
                    <>
                      <span> - </span>
                      {toPersianNumber(cityName)}
                    </>
                  )}
                  {regionName && (
                    <>
                      <span> - </span>
                      {toPersianNumber(regionName)}
                    </>
                  )}
                </>
              )}
            </p>
          </div>
        )}
        <div className="req-confirm-switch-wrapper">
          <Switch
            checked={showMobileNo}
            onChange={
              isDisabled ? () => toast.info(msg21) : mobileNoDisplayHandler
            }
            color="primary"
            disabled={isRefused}
            // size={matchesSm ? "small" : "medium"}
          />
          <label className="req-confirm-mobile-label-display">
            نمایش شماره من
          </label>
        </div>
        <div
          className={`req-confirm-btns-wrapper ${
            (isDisabled || !isClient) && "confirm-single-btn-wrapper"
          }`}
        >
          {isClient && (
            <Button
              label="تایید"
              size={matchesSm ? "xs" : "sm"}
              onClick={() => setTimeSelected()}
              disabled={isRefused}
            />
          )}
          {!isDisabled && (
            <Button
              label="انصراف"
              size={matchesSm ? "xs" : "sm"}
              variant="outlined"
              color="red"
              onClick={onTerminatingConfirm}
              disabled={isRefused}
              className={`${isClient && "req-confirm-margined-btn"}`}
            />
          )}
          {isDisabled && !isClient && (
            <Button
              label="شروع گفتگو"
              onClick={async () => await preprocsses()}
              size={matchesSm ? "xs" : "sm"}
            />
          )}
        </div>
      </Paper>
    </>
  );
}

export default InfoAndActions;
