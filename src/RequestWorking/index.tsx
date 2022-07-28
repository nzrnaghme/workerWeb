import { useState, useEffect } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./index.scss";
import { RequestWorking as RequestWorkingUrl } from "../config";
import {
  getRequisites,
  postFileMsg,
  getAudienceUserInfo,
  getReqRegistrationInfo,
  getRequestWorkingDuration,
} from "./IService";
import { useParams } from "react-router-dom";
import useSignalR from "../Components/hooks/useSignalR";
import IssueAndActions from "./presentationals/IssueAndActions";
import { MsgsState, OperatorType, PresenceTypeCategory } from "../Models/Enums";
import { IMsgsByState } from "../Models/Entities";
import { INecessities } from "./Entities";
import { toast } from "react-toastify";
import { showLocalStorage } from "../Routers/localStorage";
import { IMobileNos } from "../RequestConfirm/Entities"; //TODO: Needs refactor.
import { IResult } from "../Services/Entities";
import AvatarName from "./components/AvatarName";
import WorkingDetailsPopup from "./components/WorkingDetailsPopup";
import DetailsIconPopup from "../Images/addRequest/detailsIcon.svg";
import TimeIcon from "../Images/addRequest/timeIcon.svg";
import WorkTimePopup, { WorkTimeCallBack } from "./components/WorkTimePopup";
import DurationPopup from "./components/DurationPopup";
import PersonalCard from "../PersonalCard";
import { trackPromise } from "react-promise-tracker";
import FullDialogChat from "../Components/Chat/FullDialogChat";

const msg4 = (fullName: string) =>
  `${fullName} مدت زمان انجام کار را تایید نکرده است.`;

function RequestWorking() {
  const matchesSm = useMediaQuery("(max-width:40rem)");

  const { reqConfirmId } = useParams<any>();

  const storageUser = showLocalStorage("user");

  const [necessities, setNecessities] = useState<INecessities | undefined>();

  const connectionInstanceMaker = useSignalR();
  const [connection, setConnection] = useState<signalR.HubConnection>();
  const [isConnected, setIsConnected] = useState(false);

  const [chatGlobalConfigs, setChatGlobalConfigs] = useState({
    picMaxSize: 0,
    fileMaxSize: 0,
  });
  const [isPresence, setIsPresence] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [servantUserId, setServantUserId] = useState("");
  const [requestUserId, setRequestUserId] = useState("");
  const [requestRegistrationId, setReqRegistrationId] = useState("");
  const [audienceId, setAudienceId] = useState("");
  const [requestWorkingId, setRequestWorkingId] = useState("");
  const [prevMsgs, setPrevMsgs] = useState<IMsgsByState[] | []>([]);
  const [mobileNos, setMobileNos] = useState<IMobileNos>({
    clientNo: null,
    servantNo: null,
  });
  const [userInfo, setUserInfo] = useState({
    firstName: "نام",
    lastName: "نام خانوادگی",
    picture: " ",
  });

  const [detailOpen, setDetailOpen] = useState(false);
  const [reqRegistrationInfo, setReqRegistrationInfo] = useState({
    title: "",
    content: "",
  });

  const [durationPopup, setDurationPopup] = useState(false);
  const [duration, setDuration] = useState<string>("00:00");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [durationSeePopup, setDurationSeePopup] = useState(false);

  const [showAudienceInfo, setShowAudienceInfo] = useState(false);

  useEffect(() => {
    trackPromise(requisitesSupplier(reqConfirmId, storageUser!.Id));
  }, []);

  useEffect(() => {
    if (!connection || !isConnected) return;

    connection!.on(
      "WorkingTimeRefused",
      (reqWorkingId: string, userName: string) => {
        if (requestWorkingId !== reqWorkingId) return;
        toast.info(msg4(userName));
      }
    );
  }, [connection, isConnected]);

  useEffect(() => {
    if (audienceId === "") return;
    userInfoSupplier();
  }, [audienceId]);

  useEffect(() => {
    if (!necessities) return;
    onConnectionInstanceResolved();
    const {
      config: {
        cfgUserRegistrationPicVolumeSize,
        cfgRequestRegistrationFileVolumeSize,
      },
      confirm: {
        presenceType,
        requestRegistrationId,
        requestWorkingId,
        requestUserId,
        servantUserId,
        clientMobileNo,
        servantMobileNo,
        hasStartWorkingDate,
      },
      userMessages: {
        requestConfirmMassage,
        requestWaitingMassage,
        requestWorkingMassage,
      },
    } = necessities;

    setChatGlobalConfigs({
      picMaxSize: cfgUserRegistrationPicVolumeSize,
      fileMaxSize: cfgRequestRegistrationFileVolumeSize,
    });
    setRequestWorkingId(requestWorkingId);
    setIsPresence(presenceType === PresenceTypeCategory.Presence);
    const isClient = requestUserId === storageUser!.Id;
    setIsClient(isClient);
    setMobileNos({ clientNo: clientMobileNo, servantNo: servantMobileNo });
    setRequestUserId(requestUserId);
    setServantUserId(servantUserId);
    setAudienceId(isClient ? servantUserId : requestUserId);
    setReqRegistrationId(requestRegistrationId);

    let newLabeledMessages = [];
    if (requestConfirmMassage?.length > 0) {
      newLabeledMessages.push({
        state: MsgsState.RequestConfirm,
        messages: requestConfirmMassage,
      });
    }
    if (requestWaitingMassage?.length > 0) {
      newLabeledMessages.push({
        state: MsgsState.RequestWaiting,
        messages: requestWaitingMassage,
      });
    }
    if (requestWorkingMassage?.length > 0) {
      newLabeledMessages.push({
        state: MsgsState.RequestWorking,
        messages: requestWorkingMassage,
      });
    }
    setPrevMsgs(newLabeledMessages);
  }, [necessities, connection]);

  const callInitializer = () =>
    requisitesSupplier(reqConfirmId, storageUser!.Id);

  const requisitesSupplier = async (reqConfirmId: string, userId: string) => {
    const data = await getRequisites(reqConfirmId, userId);
    setNecessities(data.Data);
    if (data.Error) {
      toast.error("داده ها برای نمایش گفتگو کافی نیست.");
      return;
    }
  };

  const onConnectionInstanceResolved = async () => {
    if (!connection) {
      const instance = await connectionInstanceMaker(
        storageUser.AccessToken,
        setIsConnected,
        RequestWorkingUrl + "RequestWorkingHub"
      );
      setConnection(instance);
    }
  };

  const userInfoSupplier = async () => {
    const data: IResult = await getAudienceUserInfo(audienceId);
    setUserInfo({
      firstName: data.Data.firstName,
      lastName: data.Data.lastName,
      picture: data.Data.picture,
    });
  };

  const detailsClicked = async () => {
    setDetailOpen(true);

    const res = await getReqRegistrationInfo(requestRegistrationId);
    const { title, content } = res.Data;
    setReqRegistrationInfo({ title, content });
  };

  const timeClicked = async () => {
    const res = await getRequestWorkingDuration(requestWorkingId);
    setDuration(res.Data.durationOfWork);
    setDate(res.Data.startWorkingDate.split(" ")[0]);
    setTime(res.Data.startWorkingDate.split(" ")[1]);
    setDurationSeePopup(true);
  };

  const onConfirmWorkTime = (t: WorkTimeCallBack) => {
    setDuration(t.duration);
    setDurationPopup(false);
    onDurationConfirmed(t.duration);
  };

  const onDurationConfirmed = (duration: string) => {
    const hubNotification = {
      userId: requestUserId,
      SenderUserId: storageUser?.Id,
      SenderUserName: storageUser.FirstName + " " + storageUser.LastName,
    };
    connection!
      .invoke("WorkTime", duration, requestWorkingId, hubNotification)
      .catch((e: any) => {
        //console.log(e);
      });
    setDurationPopup(false);
  };

  return (
    isConnected && (
      <>
        <header className="working-header">
          {matchesSm && (
            <AvatarName
              userName={`${userInfo.firstName} ${userInfo.lastName}`}
              src={userInfo?.picture}
              {...{ isClient, mobileNos }}
              onClick={() => setShowAudienceInfo(true)}
            />
          )}
          <div
            className={`header-popup-btns-wrapper ${
              !matchesSm && "header-popup-btns-wrapper-lg-avatar"
            }`}
          >
            <div className="header-popup-btn" onClick={detailsClicked}>
              <img src={DetailsIconPopup} alt="" />
            </div>
            <div className="header-popup-btn" onClick={timeClicked}>
              <img src={TimeIcon} alt="" />
            </div>
          </div>
        </header>
        <WorkingDetailsPopup
          open={detailOpen}
          title={reqRegistrationInfo.title}
          description={reqRegistrationInfo.content}
          onClose={() => setDetailOpen(false)}
        />
        <DurationPopup
          duration={duration}
          date={date}
          time={time}
          open={durationSeePopup}
          onClose={() => setDurationSeePopup(false)}
        />
        <WorkTimePopup
          open={durationPopup}
          onConfirm={onConfirmWorkTime}
          onClose={() => setDurationPopup(false)}
        />
        <PersonalCard
          userId={audienceId}
          operatorType={isClient ? OperatorType.Servant : OperatorType.Client}
          open={showAudienceInfo}
          onClose={() => setShowAudienceInfo(false)}
        />
        <div className="chat-papers-grid-container">
          <IssueAndActions
            connection={connection!}
            userLogin={storageUser!}
            setMobileNos={setMobileNos}
            {...{
              isPresence: isPresence!,
              isClient: isClient!,
              audienceId,
              requestWorkingId,
              requestUserId,
              servantUserId,
              requestRegistrationId,
              reqConfirmId,
              mobileNos,
              setShowAudienceInfo,
              setDurationPopup,
            }}
          />
          <FullDialogChat
            connection={connection!}
            userLogin={storageUser!}
            reqId={requestWorkingId}
            {...{
              isClient,
              receiverId: audienceId,
              postFileMsg,
              chatGlobalConfigs,
              previousMessage: prevMsgs,
              state: MsgsState.RequestWorking,
              clientId: requestUserId,
              servantId: servantUserId,
              setConnection,
              callInitializer,
            }}
          />
        </div>
      </>
    )
  );
}

export default RequestWorking;
