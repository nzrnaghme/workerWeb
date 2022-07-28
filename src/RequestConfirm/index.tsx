import { useState, useEffect, useRef } from "react";
import "./index.scss";
import ButtonBase from "@material-ui/core/ButtonBase";
import * as service from "./IService";
import { RequestConfirm as RequestConfirmUrl } from "../config";
import { useParams } from "react-router-dom";
import useSignalR from "../Components/hooks/useSignalR";
import { postFileMsg, getInitialize } from "./IService";
import InfoAndActions from "./presentationals/InfoAndActions";
import Button from "../Components/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { IMsgsByState, IFileAttachment } from "../Models/Entities";
import { toast } from "react-toastify";
import {
  IInitialize,
  IInitializeModel,
  IMobileNos,
  INecessitiesBefore,
  UserInfoSummary,
} from "./Entities";
import { MsgsState, OperatorType } from "../Models/Enums";
import { IResult } from "../Services/Entities";
import { showLocalStorage } from "../Routers/localStorage";
import { trackPromise } from "react-promise-tracker";
import { toPersianNumber } from "../Components/hooks/persianHelper";
import Divider from "@material-ui/core/Divider";
import { RawAvatar } from "../Components/Avatar";
import PersonalCard from "../PersonalCard";
import Popup from "../Components/Popup";
import Attachments from "../Components/Attachments";
import LocationPopup from "../Components/LocationPopup/LocationPopup";
import attachmentsPopupIcon from "../Images/addRequest/attachmentsIcon.svg";
import locationPopupIcon from "../Images/addRequest/locationIcon.svg";
import FullDialogChat from "../Components/Chat/FullDialogChat";

// import { date } from "yup/lib/locale";

function RequestConfirm() {
  const matchesSm = useMediaQuery("(max-width:40rem)");
  const storageUser = showLocalStorage("user");
  const connectionInstanceMaker = useSignalR();
  const [connection, setConnection] = useState<signalR.HubConnection>();
  const [isConnected, setIsConnected] = useState(false);
  const { idType, reqConfirmId } = useParams<any>();
  const localReqId = useRef<string | undefined>();
  const [necessities, setNecessities] = useState<
    IInitializeModel | undefined
  >();
  const [necessitiesBefore, setNecessitiesBefore] = useState<
    INecessitiesBefore | undefined
  >();
  const [reqRegistrationInfo, setReqRegistrationInfo] = useState({
    title: "",
    content: "",
    presenceType: 1,
  });
  const [isClient, setIsClient] = useState(false);
  const [clientId, setClientId] = useState("");
  const [servantId, setServentId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [reqRegistrationId, setReqRegistrationId] = useState("");
  const [dateDeadline, setDateDeadline] = useState<number>();
  const [chatGlobalConfigs, setChatGlobalConfigs] = useState({
    picMaxSize: 0,
    fileMaxSize: 0,
  });
  const [infoGlobalConfigs, setInfoGlobalConfigs] = useState({
    price: 0,
    cancelPrice: 0,
  });
  const [chatDisable, setChatDisable] = useState(false);
  const [prevMsgs, setPrevMsgs] = useState<IMsgsByState[] | []>([]);
  const [mobileNos, setMobileNos] = useState<IMobileNos>({
    clientNo: null,
    servantNo: null,
  });
  const [shouldDisabled, setShouldDisabled] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfoSummary | undefined>();
  const [headerData, setHeaderData] = useState<any>(null);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [showAttachmentsPopup, setShowAttachmentsPopup] = useState(false);
  const [attachments, setAttachments] = useState<IFileAttachment[] | []>([]);
  const [mapOpen, setMapOpen] = useState(false);
  const [stateName, setStateName] = useState<string | null>("");
  const [cityName, setCityName] = useState<string | null>("");
  const [regionName, setRegionName] = useState<string | null>("");

  useEffect(() => {
    checkType();
  }, []);

  useEffect(() => {
    onConnectionInstanceResolved();
  }, [connection]);

  const checkType = () => {
    if (idType == "R") {
      trackPromise(
        initialize({
          userId: storageUser?.Id!,
          requestConfirmId: null,
          requestRegistrationId: reqConfirmId,
        })
      );
      setReqRegistrationId(reqConfirmId);
    } else if (idType == "C") {
      trackPromise(
        initialize({
          userId: storageUser?.Id!,
          requestConfirmId: reqConfirmId,
          requestRegistrationId: null,
        })
      );
    }
  };

  useEffect(() => {
    if (!necessities) return;
    const {
      getInitialize: {
        requestRegistrationId,
        requestConfirmId,
        requestUserId,
        servantUserId,
        clientNo,
        servantNo,
        config: {
          cfgUserRegistrationPicVolumeSize,
          cfgRequestRegistrationFileVolumeSize,
          cfgRequestRegistrationCancelPrice,
          cfgRequestRegistrationPrice,
        },
        requestConfirmMessage,
      },
      infoModel: { title, content, presenceType },
    } = necessities;

    const isClient = requestUserId === storageUser!.Id;
    setIsClient(isClient);
    setMobileNos({ clientNo, servantNo });
    setReceiverId(isClient ? servantUserId : requestUserId);
    setClientId(requestUserId);
    setServentId(servantUserId);
    setReqRegistrationId(requestRegistrationId);
    localReqId.current = requestConfirmId;
    setChatGlobalConfigs({
      picMaxSize: cfgUserRegistrationPicVolumeSize,
      fileMaxSize: cfgRequestRegistrationFileVolumeSize,
    });
    setInfoGlobalConfigs({
      price: cfgRequestRegistrationPrice,
      cancelPrice: cfgRequestRegistrationCancelPrice,
    });
    setPrevMsgs([
      { state: MsgsState.RequestConfirm, messages: requestConfirmMessage },
    ]);
    setReqRegistrationInfo({
      title: title,
      content: content,
      presenceType: presenceType,
    });
  }, [necessities]);

  useEffect(() => {
    if (!necessitiesBefore) return;
    const { title, content, presenceType, userId } = necessitiesBefore;
    setIsClient(false);
    setClientId(userId);
    setReqRegistrationInfo({
      title: title,
      content: content,
      presenceType: presenceType,
    });
  }, [necessitiesBefore]);

  useEffect(() => {
    if (!clientId && !servantId) return;
    trackPromise(GetProfileSummaryInfo());
  }, [clientId, servantId]);

  useEffect(() => {
    if (!reqRegistrationId) return;
    trackPromise(getReqRegistrationAttachments());
    trackPromise(getRequestLocationInfo());
  }, [reqRegistrationId]);

  const initialize = async (initial: IInitialize) => {
    const data: IResult = await getInitialize(initial);
    if (data.Data) {
      if (data.Data.getInitialize) {
        setDateDeadline(
          data.Data.getInitialize.config.cfgBeginWorkDateDeadline
        );
      }
    }
    if (data.Error) {
      toast.error("داده ها برای نمایش گفتگو کافی نیست.");
      return;
    }
    //if converstaion before
    if (data.Data.getInitialize != null) {
      if (
        storageUser?.Id !== data.Data.getInitialize.servantUserId &&
        storageUser?.Id !== data.Data.getInitialize.requestUserId
      ) {
        setShouldDisabled(true);
      } else {
        setNecessities(data.Data);
        setShouldDisabled(false);
      }
    }

    //else before start conversion
    else {
      setNecessitiesBefore(data.Data.infoModel);
      setShouldDisabled(true);
    }
  };

  const onConnectionInstanceResolved = async () => {
    if (connection) return;
    const instance = await connectionInstanceMaker(
      storageUser.AccessToken,
      setIsConnected,
      RequestConfirmUrl + "RequestConfirmHub"
    );
    setConnection(instance);
  };

  const master = (readOnly: boolean, isConnected: boolean) => {
    if (readOnly) {
      return chat();
    } else {
      if (isConnected) {
        return chat();
      }
    }
  };

  const GetProfileSummaryInfo = async () => {
    const data: IResult = await service.getProfileSummaryInfo(
      isClient ? servantId : clientId
    );

    setUserInfo(data.Data);
  };

  const getReqRegistrationAttachments = async () => {
    const data: IResult = await service.getRequestAttachments(
      reqRegistrationId
    );
    setAttachments(data.Data);
  };

  const getRequestLocationInfo = async () => {
    let locationInfo = await service.getRequestLocationInfo(reqRegistrationId);
    setStateName(locationInfo.Data.stateName ?? "");
    setCityName(locationInfo.Data.cityName ?? "");
    setRegionName(locationInfo.Data.regionName ?? "");
  };

  const locationUpdateHandler = async () => {
    const hubNotification = {
      SenderUserId: isClient ? clientId : servantId,
      SenderUserName: storageUser.FirstName + " " + storageUser.LastName,
    };
    connection
      ?.invoke("UpdateRequestLocation", reqRegistrationId, hubNotification)
      .catch((e: any) => {
        //console.log(e);
      });
  };

  const getReqConfirmHeaderData = (data: Object) => setHeaderData(data);

  const headerAndPopups = (
    <>
      <Popup
        open={showAttachmentsPopup}
        onClose={() => setShowAttachmentsPopup(false)}
        className="req-confirm-attachments-popup"
      >
        <div className="req-confirm-attachments-wrapper">
          <p className="req-confirm-attachments-heading">فایل های پیوست</p>
          <Attachments
            {...{ attachments }}
            getFileAttachment={service.getRequestAttachmentById}
          />
        </div>
        <div className="req-confirm-attachments-btn">
          <Button
            onClick={() => setShowAttachmentsPopup(false)}
            size={matchesSm ? "xs" : "sm"}
            variant="outlined"
            color="blue"
            label="بازگشت"
          />
        </div>
      </Popup>
      <Popup
        open={mapOpen}
        onClose={() => {
          setMapOpen(false);
        }}
        className="location-popup"
      >
        <LocationPopup
          requestRegisteration={reqRegistrationId!}
          disabled={!isClient && !shouldDisabled}
          isClient={isClient}
          onConfirm={(s) => {
            if (s.isChanged == true) {
              locationUpdateHandler();
              setStateName(s.regionsName![0]);
              setCityName(s.regionsName![1]);
              setRegionName(s.regionsName![2]);
            }
            setMapOpen(false);
          }}
          handleClose={() => {
            setMapOpen(false);
          }}
        />
      </Popup>
      <PersonalCard
        userId={isClient ? servantId : clientId}
        operatorType={isClient ? OperatorType.Servant : OperatorType.Client}
        open={showInfoPopup}
        onClose={() => setShowInfoPopup(false)}
      />
      {headerData && (
        <header className="req-confirm-header">
          <div className="r-c-avatar-name-wrapper">
            <ButtonBase
              className="req-confirm-avatar-btn"
              onClick={() => setShowInfoPopup(true)}
              disabled={headerData.isRefused}
            >
              <RawAvatar
                src={userInfo?.picture ?? " "}
                size="sm"
                personalCard
              />
            </ButtonBase>
            <div className="req-confirm-name-number-wrapper">
              <p
                onClick={() => !headerData.isRefused && setShowInfoPopup(true)}
                className={`req-confirm-name ${
                  !headerData.isRefused && "req-confirm-text-active"
                }`}
              >
                {`${userInfo?.firstName ?? ""} ${userInfo?.lastName ?? ""}`}
              </p>
              {((headerData.clientMobileNo && !isClient) ||
                (headerData.servantMobileNo && isClient)) && (
                <Divider className="req-confirm-name-num-divider" />
              )}
              <p className="req-confirm-mobile">
                {!isClient
                  ? headerData.clientMobileNo
                    ? toPersianNumber(headerData.clientMobileNo)
                    : undefined
                  : headerData.servantMobileNo
                  ? toPersianNumber(headerData.servantMobileNo)
                  : undefined}
              </p>
            </div>
          </div>
          <div className="req-confirm-popup-btns-wrapper" dir="ltr">
            {reqRegistrationInfo.presenceType === 0 && (
              <div
                className="header-popup-btn"
                onClick={
                  headerData.isDisabled
                    ? () => toast.info(headerData.msg21)
                    : () => setMapOpen(true)
                }
              >
                <img src={locationPopupIcon} alt="" />
              </div>
            )}
            <div
              className="header-popup-btn"
              onClick={() => setShowAttachmentsPopup(true)}
            >
              <img src={attachmentsPopupIcon} alt="" />
            </div>
          </div>
        </header>
      )}
    </>
  );

  const chat = () => {
    return (
      <>
        {headerAndPopups}
        <div className="chat-papers-grid-container">
          <InfoAndActions
            init={checkType}
            deadline={dateDeadline!}
            connection={connection!}
            userLogin={storageUser!}
            requestConfirmId={localReqId.current!}
            {...{
              isClient,
              receiverId,
              infoGlobalConfigs,
              reqRegistrationId,
              clientId,
              servantId,
              setChatDisable,
              mobileNos,
              shouldDisabled,
              reqRegistrationInfo,
              getReqConfirmHeaderData,
              userInfo,
              stateName,
              cityName,
              regionName,
              getRequestLocationInfo,
            }}
          />
          {connection && (
            <FullDialogChat
              connection={connection!}
              userLogin={storageUser!}
              reqId={localReqId.current!}
              {...{
                isClient,
                receiverId,
                postFileMsg,
                chatGlobalConfigs,
                previousMessage: prevMsgs,
                state: MsgsState.RequestConfirm,
                clientId,
                servantId,
                setConnection,
                callInitializer: checkType,
              }}
              disabled={chatDisable}
              shouldDisabled={shouldDisabled}
            />
          )}
        </div>
      </>
    );
  };

  return <>{master(shouldDisabled, isConnected)}</>;
}

export default RequestConfirm;
