import { useEffect, useState } from "react";
import "./index.scss";
import { RequestWaiting } from "../../config";
import { useParams } from "react-router-dom";
import MapContainer from "../../Components/Maps/MapContainer";
import { ILocation } from "../../Components/Maps/Entities";
import Paper from "../../Components/Paper";
import { RawAvatar } from "../../Components/Avatar";
import Popup from "../../Components/Popup";
import Button from "../../Components/Button";
import Switch from "@material-ui/core/Switch";
import Divider from "@material-ui/core/Divider";
import ButtonBase from "@material-ui/core/ButtonBase";
import locationIcon from "../../Images/addRequest/locationIcon.svg";
import timeIcon from "../../Images/addRequest/timeIcon.svg";
import LocationPopup from "../../Components/LocationPopup/LocationPopup";
import detailIconPopup from "../../Images/addRequest/detailsIcon.svg";
import * as service from "./Service";
import useSignalR from "../../Components/hooks/useSignalR";
import { IRefuseRequest } from "./Entities";
import { useHistory } from "react-router-dom";
import { useGeneralContext } from "../../Providers/GeneralContext";
import { IMsgsByState } from "../../Models/Entities";
import Extend from "./Components/ExtendWaitingPopup";
import { timeToString } from "../../Components/DateTimePicker/dateHelper";
import TimeWaitingPopup from "./Components/TimeWaitingPopup";
import { toast } from "react-toastify";
import {
  MsgsState,
  OperatorType,
  PresenceTypeCategory,
} from "../../Models/Enums";
import { IResult } from "../../Services/Entities";
import DetailsWaitingPopup from "./Components/WaitingDetailsPopup/index";
import { toPersianNumber } from "../../Components/hooks/persianHelper";
import { showLocalStorage } from "../../Routers/localStorage";
import { useMediaQuery } from "@material-ui/core";
import { IMobileNos } from "../../RequestConfirm/Entities";
import PersonalCard from "../../PersonalCard";
import { trackPromise } from "react-promise-tracker";
import FullDialogChat from "../../Components/Chat/FullDialogChat";

function WaitingToArrived() {
  const matchesSm = useMediaQuery("(max-width:40rem)");
  const storageUser = showLocalStorage("user");
  interface UserInfoSummary {
    id: string;
    firstName: string;
    lastName: string;
    picture: string;
  }
  const [userInfo, setUserInfo] = useState<UserInfoSummary | undefined>();
  const { onConfirmSetter, setConfirmPopupOpen } = useGeneralContext();
  const history = useHistory();
  const connectionInstanceMaker = useSignalR();
  const [connection, setConnection] = useState<signalR.HubConnection>();
  const [isClient, setIsClient] = useState<boolean>(false);
  const match = useParams<any>();
  const [servantLocation, setServantLocation] = useState<ILocation | null>(
    null
  );
  const [clientLocation, setClientLocation] = useState<ILocation | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [servantId, setServantId] = useState("");
  const [clientId, setClientId] = useState("");
  const [requestWaiting, setRequestWaiting] = useState();
  const [requestRegisteration, setRequestRegisteration] = useState();
  const [refuseRequest, setRefuseRequest] = useState<IRefuseRequest>();
  const [chatGlobalConfigs, setChatGlobalConfigs] = useState({
    picMaxSize: 0,
    fileMaxSize: 0,
  });
  const [infoGlobalConfigs, setInfoGlobalConfigs] = useState({
    price: 0,
    cancelPrice: 0,
  });

  const [locationUpdateTime, setLocationUpdateTime] = useState<
    number | undefined
  >();
  const [prevMsgs, setPrevMsgs] = useState<IMsgsByState[] | []>([]);
  const [presence, setPresence] = useState<PresenceTypeCategory>();
  //popups
  const [extendOpen, setExtendOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);

  //messages
  const msg18 =
    "آیا مطمئن هستید برای کاربر طرف مقابل می خواهید اعلام تاخیر کنید؟";
  const msg17 =
    "آیا مطمئن هستید که شماره موبایل برای طرف مقابل نمایش داده نشود؟";
  const msg16 =
    "آیا مطمئن هستید که شماره موبایل برای طرف مقابل نمایش داده شود؟";
  const msg15 = (fullName: string) =>
    `${fullName} محل خدمت را به روز رسانی کرده است، لطفا آن را بررسی نمایید`;
  const msg12 = (fullName: string) =>
    `${fullName} در حال آمدن به محل خدمت است.`;
  const msg11 =
    "جهت اعلام شروع و نمایش حرکت خدمت دهنده لطفا محل خدمت را تعیین نمایید.";
  const msg10 = "درخواست دهنده محل انجام خدمت را مشخص نکرده است";
  const msg9 = (fullName: string) =>
    `${fullName} اعلام رسیدن کرده است، آیا رسیدن او را تایید می کنید و آیا چهره او با عکس پروفایلش مطابقت دارد؟`;
  const msg7 = "از تاخیر به وجود آمده متاسفیم، درحال پیگیری هستیم";
  const msg6 = (fullName: string) =>
    `${fullName} برای رسیدن شما اعلام تاخیر کرده است، می توانید با توافق زمان انجام کار را تمدید کنید`;
  const msg5 = "کاربر طرف مقابل تمدید زمان انجام کار را تایید نکرده است";
  const msg3 = (fullName: string) =>
    `${fullName} درخواست را لغو کرده است، مبلغ حق فسخ به کیف پول شما اضافه می گردد`;
  const msg2 =
    "با لغو درخواست مبلغ حق فسخ از کیف پول شما کسر می گردد و به کیف پول طرف مقابل اضافه می شود، آیا ادامه می دهید؟";
  const fullNameMaker = (firstName: string, lastName: string) =>
    firstName + " " + lastName;
  //icons
  const [lIcon, setLIcon] = useState(locationIcon);
  const [tIcon, setTIcon] = useState(timeIcon);
  const [dIcon, setDIcon] = useState(detailIconPopup);

  //time
  const [date, setDate] = useState<Date>(new Date());
  const [timePopup, setTimepopup] = useState<string>("");
  const [persianDate, setPersianDate] = useState("");
  //map
  const [isPast, setIsPast] = useState(false);
  const [showStartBackdrop, setShowStartBackdrop] = useState(false);

  //details
  const [reqRegistrationInfo, setReqRegistrationInfo] = useState({
    title: "",
    content: "",
  });

  //mobileNo
  const [showMobileNo, setShowMobileNo] = useState(false);
  const [mobileNos, setMobileNos] = useState<IMobileNos>({
    clientNo: null,
    servantNo: null,
  });

  useEffect(() => {
    trackPromise(setClientLocationHandler());
  }, [isClient]);

  useEffect(() => {
    if (!storageUser) return;
    trackPromise(getInitialize());
    trackPromise(getGlobalConfigs());
  }, []);

  useEffect(() => {
    if (!servantLocation) return;

    if (servantLocation.name === "tracking") {
      if (!isClient) {
        connection
          ?.invoke("Tracking", requestWaiting, servantLocation, clientId)
          .catch((e: any) => {
            //console.log(e);
          });
      }
    }
  }, [servantLocation]);

  useEffect(() => {
    if (requestWaiting != undefined && refuseRequest != undefined) {
      trackPromise(checkTime());
      trackPromise(servantIsMoved());
      trackPromise(GetProfileSummaryInfo());
      onConnectionInstanceResolved();
    }
  }, [requestWaiting, refuseRequest, connection]);

  useEffect(() => {
    if (connection === undefined) return;

    const { clientNo, servantNo } = mobileNos;
    if ((isClient && clientNo) || (!isClient && servantNo)) {
      setShowMobileNo(true);
    }
    setMobileNos({
      clientNo: mobileNos.clientNo,
      servantNo: mobileNos.servantNo,
    });

    connection?.on("ServantMobileNo", (reqWaitingId: string, mobileNo: any) => {
      if (requestWaiting !== reqWaitingId) return;
      setMobileNos((prev) => ({ ...prev, servantNo: mobileNo }));
    });

    connection?.on("ClientMobileNo", (reqWaitingId: string, mobileNo: any) => {
      if (requestWaiting !== reqWaitingId) return;
      setMobileNos((prev) => ({ ...prev, clientNo: mobileNo }));
    });

    connection?.on("Location", (reqWaitingId: string, location: ILocation) => {
      if (requestWaiting !== reqWaitingId) return;
      setServantLocation(location);
    });

    connection?.on("StartMoving", (requeWaitingId, userName) => {
      if (requeWaitingId !== requestWaiting) return;
      toast.info(msg12(userName));
      setShowStartBackdrop(false);
    });

    connection?.on("UpdateLocation", (reqWaitingId, userName) => {
      if (reqWaitingId !== requestWaiting) return;
      toast.info(msg15(userName));
    });

    connection?.on("ExtendTime", (renewRequestWaiting, userName) => {
      let ti =
        renewRequestWaiting.showActionDate.split("T")[1].split(":")[0] +
        ":" +
        renewRequestWaiting.showActionDate.split("T")[1].split(":")[1];
      if (renewRequestWaiting.requestWaitingId !== requestWaiting) return;
      const msg4 = `${userName} زمان ${toPersianNumber(ti)}
        را برای تمدید وارد کرده است آیا تایید می کنید؟`;
      setTimepopup(ti);
      setDate(new Date(renewRequestWaiting.showActionDate));
      onConfirmSetter(
        msg4,
        () => {
          renewRequestWaitingHub(renewRequestWaiting);
        },
        refuseExtendTimeHub
      );
      setConfirmPopupOpen(true);
    });

    //todo
    connection?.on("renewRequestWaiting", (reqWaitingId) => {
      if (reqWaitingId !== requestWaiting) return;
      //toast.info("تمدید را تایید کرده است");
    });

    connection?.on("Delay", (reqWaitingId, userName) => {
      if (reqWaitingId !== requestWaiting) return;
      toast.info(msg6(userName));
    });

    connection?.on("RefuseRequestByRequestUser", (refuseReqUser, userName) => {
      if (refuseReqUser !== requestWaiting) return;
      if (window.location.pathname.includes("/WaitingToArrived/")) {
        history.push("/");
      }
      toast.info(msg3(userName));
    });

    connection.on("RefusedExtendTime", (reqWaitingId) => {
      if (reqWaitingId !== requestWaiting) return;
      toast.info(msg5);
    });

    connection?.on("IsArrive", (reqWaitingId, userName) => {
      if (reqWaitingId !== requestWaiting) return;
      onConfirmSetter(
        msg9(userName),
        () => {
          trackPromise(arrived());
          trackPromise(start(true));
          connection
            ?.invoke(
              "ConfirmStart",
              isClient ? servantId : clientId,
              requestWaiting
            )
            .then((e) => {
              if (e) {
                history.replace("/");
                history.push(`/requestworking/${match.requestConfirmId}`);
              }
            })
            .catch((e: any) => {
              //console.log(e);
            });
        },
        () => {
          trackPromise(refuseArrived());
        }
      );
      setConfirmPopupOpen(true);
    });

    connection.on("ConfirmStart", (reqWaitingId) => {
      if (reqWaitingId !== requestWaiting) return;
      setConfirmPopupOpen(false);
      history.replace("/");
      connection!.stop().catch(console.log);
      history.push(`/requestworking/${match.requestConfirmId}`);
    });

    connection?.on("RefuseRequestByServantUser", (refuseReqUser, userName) => {
      if (refuseReqUser !== requestWaiting) return;
      toast.info(msg3(userName));
      if (window.location.pathname.includes("/WaitingToArrived/")) {
        history.push("/");
      }
    });
  }, [connection]);

  const checkTime = async () => {
    const res = await service.getRequestEstimatedWorkDate({
      requestWaitingId: requestWaiting!,
      requestConfirmId: match.requestConfirmId,
    });
    showDelay(res.Data.date);
    let interval = setInterval(() => {
      showDelay(res.Data.date);
    }, 1000);
  };

  const showDelay = (time: string) => {
    let workDate = new Date(time);
    let now = new Date();
    //TODO - checkShavad
    if (workDate < now) {
      setIsPast(true);
    }
  };

  // const timerLocation = async () => {};

  const onConnectionInstanceResolved = async () => {
    if (!connection) {
      const instance = await connectionInstanceMaker(
        storageUser.AccessToken,
        setIsConnected,
        RequestWaiting + "RequestWaitingHub"
      );
      setConnection(instance);
    }
  };

  const setClientLocationHandler = async () => {
    if (!requestRegisteration) return;
    let locationInfo = await service.getRequestLocationInfo(
      requestRegisteration!
    );
    setClientLocation(locationInfo.Data.location);
  };

  const getInitialize = async () => {
    if (storageUser) {
      const response = await service.getInitialize(
        match.requestConfirmId,
        storageUser.Id
      );
      let newLabeledMessages = [];
      if (response.Data) {
        if (response.Data.requestConfirmMessage) {
          if (response.Data.requestConfirmMessage?.length > 0) {
            newLabeledMessages.push({
              state: MsgsState.RequestConfirm,
              messages: response.Data.requestConfirmMessage,
            });
          }
        }
      }
      if (response.Data) {
        if (response.Data.requestWaitingMessage) {
          if (response.Data.requestWaitingMessage?.length > 0) {
            newLabeledMessages.push({
              state: MsgsState.RequestWaiting,
              messages: response.Data.requestWaitingMessage,
            });
          }
        }
      }
      setMobileNos({
        clientNo:
          response.Data.clientNo === null ? null : response.Data.clientNo,
        servantNo:
          response.Data.servantNo === null ? null : response.Data.servantNo,
      });
      if (response.Data.requestUserId == storageUser!.Id) setIsClient(true);
      else setIsClient(false);
      setPrevMsgs(newLabeledMessages);
      setRequestWaiting(response.Data.requestWaitingId);
      setRequestRegisteration(response.Data.requestRegistrationId);
      setServantId(response.Data.servantUserId);
      setClientId(response.Data.requestUserId);
      setPresence(response.Data.presenceType);
      setClientLocation(response.Data.location);
      setRefuseRequest({
        requestWaitingId: response.Data.requestWaitingId,
        servantUserId: response.Data.servantUserId,
        requestUserId: response.Data.requestUserId,
        requestRegistrationId: response.Data.requestRegistrationId,
      });
    }
  };

  const GetProfileSummaryInfo = async () => {
    let userId = isClient ? servantId : clientId;
    const data: IResult = await service.getSummaryUserProfileInfo(userId);
    setUserInfo(data.Data);
  };

  const arrived = async () => {
    const response = await service.arrivedConfirmRequestWaiting({
      requestWaitingId: requestWaiting!,
      requestRegistrationId: requestRegisteration!,
    });
  };

  const refuseArrived = async () => {
    const res = await service.arrivedRefuseRequestWaiting({
      requestWaitingId: requestWaiting!,
      arriveRefuseUserId: isClient ? servantId : clientId,
    });
  };

  const mapClicked = async () => {
    setMapOpen(true);
  };

  const servantIsMoved = async () => {
    let moveRequest = await service.hasMoveRequestWaiting(requestWaiting!);
    if (moveRequest.Error) return;
    if (moveRequest.Data) {
      setShowStartBackdrop(false);
    } else {
      setShowStartBackdrop(true);
    }
  };

  const timeClicked = async () => {
    setTimeOpen(true);
    let dateTime = await service.getRequestEstimatedWorkDate({
      requestWaitingId: requestWaiting!,
      requestConfirmId: match.requestConfirmId,
    });
    setPersianDate(dateTime.Data.persianDate);
    setDate(new Date(dateTime.Data.date));
    setTimepopup(
      dateTime.Data.date.split("T")[1].split(":")[0] +
        ":" +
        dateTime.Data.date.split("T")[1].split(":")[1]
    );
  };

  const detailsClicked = async () => {
    setDetailOpen(true);
    const res = await service.getReqRegistrationInfo(requestRegisteration!);
    const { title, content } = res.Data;
    setReqRegistrationInfo({ title, content });
  };

  const getGlobalConfigs = async () => {
    const data: IResult = await service.getConfigs();
    const picMaxSize = data.Data.cfgUserRegistrationPicVolumeSize;
    const fileMaxSize = data.Data.cfgRequestRegistrationFileVolumeSize;
    const price = data.Data.cfgRequestRegistrationPrice;
    const cancelPrice = data.Data.cfgRequestRegistrationCancelPrice;
    setLocationUpdateTime(data.Data.cfgLocationUpdateTime * 1000);
    setChatGlobalConfigs({ picMaxSize, fileMaxSize });
    setInfoGlobalConfigs({ price, cancelPrice });
  };

  const start = async (isStoped: boolean) => {
    if (isClient) return;
    const isFilled = await service.hasRequestRegistrationLocation(
      requestRegisteration!
    );
    if (isFilled.Error) return;
    if (!isFilled.Data) {
      toast.info(msg10);
    }
    const hubNotification = {
      userId: clientId,
      SenderUserId: storageUser?.Id,
      SenderUserName: storageUser.FirstName + " " + storageUser.LastName,
    };
    if (!isStoped) {
      connection
        ?.invoke("StartMoving", requestWaiting, hubNotification)
        .catch((e: any) => {
          //console.log(e);
        });
    }
    setShowStartBackdrop(false);
    let interval = setInterval(async () => {
      if (!navigator.geolocation) {
      } else {
        var watchID = await navigator.geolocation.watchPosition(
          (position) => {
            setServantLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              name: "tracking",
              date: "2022-01-23T12:08:33.178Z",
            });
          },
          (e) => {
            // console.log(e);
          },
          { timeout: 1000 }
        );
        var timeout = setTimeout(function () {
          navigator.geolocation.clearWatch(watchID);
        }, 3000);
      }
      if (isStoped) {
        clearInterval(interval);
        // console.log("interval cleared!");
      }
    }, 5000);
  };

  const refuseRequestClientInvoke = async (
    refuseRequestUser: IRefuseRequest
  ) => {
    connection
      ?.invoke(
        "RefuseRequestWaitingByRequestUser",
        refuseRequestUser,
        storageUser.FirstName + " " + storageUser.LastName
      )
      .catch((e: any) => {
        //console.log(e);
      });
    history.push("/");
  };

  const refuseRequestServantInvoke = async (
    refuseRequestUser: IRefuseRequest
  ) => {
    connection
      ?.invoke(
        "RefuseRequestWaitingByServantUser",
        refuseRequestUser,
        storageUser.FirstName + " " + storageUser.LastName
      )
      .catch((e: any) => {
        //console.log(e);
      });
    history.push("/");
  };

  const renewRequestWaitingHub = async (s: any) => {
    connection
      ?.invoke("RenewRequestWaiting", isClient ? servantId : clientId, s)
      .catch((e: any) => {
        //console.log(e);
      });
  };

  const refuseExtendTimeHub = async () => {
    connection
      ?.invoke(
        "RefuseExtendTime",
        requestWaiting,
        isClient ? servantId : clientId
      )
      .catch((e: any) => {
        //console.log(e);
      });
  };

  const submit = () => {
    const hubNotification = {
      userId: isClient ? servantId : clientId,
      SenderUserId: storageUser?.Id,
      SenderUserName: storageUser.FirstName + " " + storageUser.LastName,
    };
    trackPromise(start(true));
    connection
      ?.invoke("IsArrive", requestWaiting, hubNotification)
      .catch((e: any) => {
        //console.log(e);
      });
  };

  const delay = async () => {
    onConfirmSetter(msg18, () => delayInvoke());
    setConfirmPopupOpen(true);
  };

  const delayInvoke = () => {
    connection
      ?.invoke(
        "DelayRequestWaiting",
        {
          requestWaitingId: requestWaiting,
          userId: storageUser.Id,
          otherUserId: isClient ? servantId : clientId,
          requestRegistrationId: requestRegisteration,
        },
        storageUser.FirstName + " " + storageUser.LastName
      )
      .catch((e: any) => {
        //console.log(e);
      });
    toast.info(msg7);
  };

  const extend = () => {
    setExtendOpen(true);
  };

  const reject = async () => {
    if (refuseRequest) {
      onConfirmSetter(
        msg2,
        isClient
          ? () => refuseRequestClientInvoke(refuseRequest)
          : () => refuseRequestServantInvoke(refuseRequest)
      );
      setConfirmPopupOpen(true);
    }
  };

  const updateLocationHub = () => {
    const hubNotification = {
      userId: servantId,
      SenderUserId: storageUser?.Id,
      SenderUserName: storageUser.FirstName + " " + storageUser.LastName,
    };
    connection
      ?.invoke("UpdateLocationDestination", requestWaiting, hubNotification)
      .catch((e: any) => {
        //console.log(e);
      });
  };

  const extendTime = (s: any) => {
    connection
      ?.invoke(
        "ExtendTime",
        isClient ? servantId : clientId,
        {
          requestConfirmId: match.requestConfirmId,
          requestWaitingId: requestWaiting,
          userId: storageUser?.Id,
          actionDate: timeToString(s.time),
        },
        storageUser.FirstName + " " + storageUser.LastName
      )
      .catch((e: any) => {
        //console.log(e);
      });
  };

  const mobileNoDisplayHandler = () => {
    if (!showMobileNo) {
      onConfirmSetter(msg16, () => displayNoForOther(true));
      setConfirmPopupOpen(true);
    } else {
      onConfirmSetter(msg17, () => displayNoForOther(false));
      setConfirmPopupOpen(true);
    }
  };

  const displayNoForOther = (isPermitted: boolean) => {
    if (isClient) {
      connection
        ?.invoke(
          "ShowMobileNoForServant",
          requestWaiting,
          servantId,
          isPermitted
        )
        .catch((e: any) => {
          //console.log(e);
        });
    } else {
      connection
        ?.invoke("ShowMobileNoForClient", requestWaiting, clientId, isPermitted)
        .catch((e: any) => {
          //console.log(e);
        });
    }
    setShowMobileNo(isPermitted);
  };

  const isPresent = presence === PresenceTypeCategory.Presence;

  const wideAbsence = !isPresent && !matchesSm;

  const headerAvatarName = (
    <div
      className={`avatar-name-wrapper ${
        wideAbsence && "avatar-name-wrapper-absence"
      }`}
    >
      <ButtonBase
        className="avatar-btn"
        onClick={() => {
          setShowInfoPopup(true);
        }}
      >
        <RawAvatar
          personalCard
          src={userInfo?.picture ?? " "}
          size={wideAbsence ? "lg" : "sm"}
        />
      </ButtonBase>
      <div
        className={`name-mobile-wrapper ${
          wideAbsence && "name-mobile-wrapper-absence"
        }`}
      >
        <p
          onClick={() => {
            setShowInfoPopup(true);
          }}
          className={`name ${"text-active"}`}
        >
          {fullNameMaker(userInfo?.firstName ?? " ", userInfo?.lastName ?? " ")}
        </p>

        {((mobileNos.clientNo && !isClient) ||
          (mobileNos.servantNo && isClient)) && (
          <Divider
            className={`name-mobile-divider ${
              wideAbsence && "name-mobile-divider-absence"
            }`}
          />
        )}
        <p className="mobile">
          {!isClient
            ? mobileNos.clientNo
              ? toPersianNumber(mobileNos.clientNo)
              : undefined
            : mobileNos.servantNo
            ? toPersianNumber(mobileNos.servantNo)
            : undefined}
        </p>
      </div>
    </div>
  );
  return (
    <>
      <header className="w8ing-header">
        {wideAbsence ? null : headerAvatarName}
        <div
          className={`header-popup-btns-wrapper ${
            wideAbsence && "header-popup-btns-wrapper-absence"
          }`}
        >
          {isPresent && (
            <div className="header-popup-btn">
              <img src={lIcon} onClick={mapClicked} alt="" />
            </div>
          )}
          <div className="header-popup-btn">
            <img
              src={dIcon}
              onClick={() => {
                trackPromise(detailsClicked());
              }}
              alt=""
            />
          </div>
          <div className="header-popup-btn">
            <img
              src={tIcon}
              onClick={() => {
                trackPromise(timeClicked());
              }}
              alt=""
            />
          </div>
        </div>
      </header>
      <div className="chat-papers-grid-container">
        <Paper className="chat-complementary-paper w8ing-paper">
          {isPresent && (
            <>
              {!isClient && showStartBackdrop && (
                <div className="w8ting-map-backdrop">
                  <Button
                    onClick={() => trackPromise(start(false))}
                    label="شروع حرکت"
                    size={matchesSm ? "sm" : "lg"}
                  />
                </div>
              )}
              <MapContainer
                canDelete={false}
                userLocation //later must delete
                disabled
                servantLocation={servantLocation}
                clientLocation={clientLocation}
                center={
                  servantLocation
                    ? [servantLocation.longitude, servantLocation.latitude]
                    : clientLocation
                    ? [clientLocation?.longitude, clientLocation?.latitude]
                    : null
                }
                onLocationChange={(c: ILocation) => {
                  //setMyLocation(c);
                }}
              />
            </>
          )}
          {wideAbsence && headerAvatarName}
          <div
            className={`wa8ing-switch-wrapper ${
              wideAbsence && "wa8ing-switch-wrapper-absence"
            } ${
              !isPresent && matchesSm && "wa8ing-switch-wrapper-absence-narrow"
            }`}
          >
            <label className="wa8ing-mobile-diplay-label">
              نمایش شماره همراه من
            </label>
            <Switch
              checked={showMobileNo}
              onChange={mobileNoDisplayHandler}
              color="primary"
              size={matchesSm ? "small" : "medium"}
            />
          </div>
          <div className="w8ing-btn-sets-wrapper">
            <div className="w8ing-btns-wrapper">
              <Button
                size={matchesSm ? "sm" : "lg"}
                onClick={submit}
                color="green"
                variant="outlined"
                label="تایید رسیدن"
                className="w8ing-btn"
              />
              <Button
                size={matchesSm ? "sm" : "lg"}
                onClick={extend}
                color="blue"
                variant="outlined"
                label="تمدید"
                className="w8ing-btn"
              />
            </div>
            <div className="w8ing-btns-wrapper">
              <Button
                size={matchesSm ? "sm" : "lg"}
                onClick={delay}
                color="orange"
                variant="outlined"
                label="اعلام تاخیر"
                className="w8ing-btn"
                disabled={!isPast}
              />
              <Button
                size={matchesSm ? "sm" : "lg"}
                onClick={reject}
                color="red"
                variant="outlined"
                label="لغو"
                className="w8ing-btn"
              />
            </div>
          </div>
        </Paper>
        <FullDialogChat
          connection={connection!}
          userLogin={storageUser!}
          reqId={requestWaiting!}
          {...{
            isClient,
            receiverId: isClient ? servantId : clientId,
            postFileMsg: service.postFileMsg,
            chatGlobalConfigs,
            previousMessage: prevMsgs,
            state: MsgsState.RequestWaiting,
            clientId,
            servantId,
            setConnection,
            callInitializer: getInitialize,
          }}
        />
      </div>

      {/* Map */}
      <Popup
        open={mapOpen}
        onClose={() => {
          setMapOpen(false);
          setLIcon(locationIcon);
        }}
        className="location-popup"
      >
        <LocationPopup
          requestRegisteration={requestRegisteration!}
          disabled={!isClient ? true : showStartBackdrop ? false : true}
          isClient={isClient}
          onConfirm={(s) => {
            if (s.isChanged === true) {
              updateLocationHub();
              setClientLocation(s.location!);
            }
            setMapOpen(false);
            setLIcon(locationIcon);
          }}
          handleClose={() => {
            setMapOpen(false);
            setLIcon(locationIcon);
          }}
        />
      </Popup>

      {/* Time */}
      <Popup
        open={timeOpen}
        onClose={() => {
          setTimeOpen(false);
          setTIcon(timeIcon);
        }}
        className="dates-popup"
      >
        <TimeWaitingPopup
          currentPersianDate={persianDate}
          currentTime={timePopup}
          handleClose={() => {
            setTimeOpen(false);
            setTIcon(timeIcon);
          }}
        />
      </Popup>

      {/* extend */}
      <Popup
        open={extendOpen}
        onClose={() => {
          setExtendOpen(false);
        }}
        className="w8ing-extend-popup"
      >
        <Extend
          onConfirm={(s) => {
            setExtendOpen(false);
            extendTime(s);
          }}
          handleClose={() => setExtendOpen(false)}
        />
      </Popup>

      {/* details */}
      <DetailsWaitingPopup
        open={detailOpen}
        title={reqRegistrationInfo.title}
        content={reqRegistrationInfo.content}
        onClose={() => setDetailOpen(false)}
      />

      {/* personalCard */}
      <PersonalCard
        userId={isClient ? servantId : clientId}
        operatorType={isClient ? OperatorType.Servant : OperatorType.Client}
        open={showInfoPopup}
        onClose={() => setShowInfoPopup(false)}
      />
    </>
  );
}
export default WaitingToArrived;
