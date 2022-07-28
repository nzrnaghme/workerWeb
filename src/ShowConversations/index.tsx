import { useState, useEffect } from "react";
import "./index.scss";
import ChatDisplay from "../Components/Chat/ChatDisplay";
import Popup from "../Components/Popup";
import { RawAvatar } from "../Components/Avatar";
import Divider from "@material-ui/core/Divider";
import { IMsgsByState } from "../Models/Entities";
import Button from "../Components/Button";
import * as service from "./service";
import { MsgsState } from "../Models/Enums";
import { IRequestMessage } from "./Entites";
import { IResult } from "../Services/Entities";
import { IUserInfo } from "../Models/Entities";
import {
  addLocalStorage,
  removeLocalStorage,
  showLocalStorage,
} from "../Routers/localStorage";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import SimpleBar from "simplebar-react";
import { trackPromise } from "react-promise-tracker";

interface ReqInfo {
  clientId: string;
  servantId: string;
  isClient: boolean;
}

const noMsgsYetHint = (isClient: boolean) =>
  `گفتگویی با ${isClient ? "همیار" : "درخواست دهنده"} وجود ندارد.`;

type Props = {
  reqConfirmId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  whichOne: boolean;
};

function ShowConversations({ reqConfirmId, open, setOpen, whichOne }: Props) {
  const matchesSm = useMediaQuery("(max-width:40rem)");

  const [userInfo, setUserInfo] = useState<IUserInfo>();
  const [reqInfo, setReqInfo] = useState<ReqInfo | undefined>();
  const [msgsByState, setMsgsByState] = useState<
    IMsgsByState[] | [] | undefined
  >();
  const storageUser = showLocalStorage("user");

  useEffect(() => {
    if (storageUser != null) {
      trackPromise(getMsgs(reqConfirmId, storageUser.Id));
    }
  }, []);

  useEffect(() => {
    if (!reqInfo) return;
    if (whichOne) trackPromise(getUserProfileSummary(reqInfo.servantId));
    else trackPromise(getUserProfileSummary(reqInfo.clientId));
  }, [reqInfo]);

  const getUserProfileSummary = async (id: string) => {
    const info: IResult = await service.getProfileSummaryInfo(id);
    setUserInfo(info.Data);
  };

  const getMsgs = async (reqConfirmId: string, userId: string) => {
    let res: IResult = await service.GetRequestUserMessage(
      reqConfirmId,
      userId
    );
    if (res.Error != null) return;
    const AllMessage = res.Data as IRequestMessage;
    if (!AllMessage.getUserAllMessages) {
      return;
    }
    let requestConfirmMassage =
      AllMessage.getUserAllMessages.requestConfirmMassage;
    let requestWaitingMassage =
      AllMessage.getUserAllMessages.requestWaitingMassage;
    let requestWorkingMassage =
      AllMessage.getUserAllMessages.requestWorkingMassage;

    setReqInfo({
      clientId: AllMessage.requestUserId,
      servantId: AllMessage.servantUserId,
      isClient: AllMessage.requestUserId === storageUser!.Id,
    });

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
    setMsgsByState(newLabeledMessages);
  };

  return (
    <>
      <Popup
        {...{ open }}
        className="show-conversations-popup"
        onClose={() => {
          setOpen(false);
        }}
      >
        {userInfo && (
          <header className="show-conversations-header">
            <RawAvatar src={userInfo.picture} size="sm" personalCard />
            <Divider
              orientation="vertical"
              className="show-conversations-header-divider"
            />
            <p className="show-conversations-header-username">
              {userInfo.firstName + " " + userInfo.lastName}
            </p>
          </header>
        )}
        <Divider className="show-conversations-main-divider" />
        <SimpleBar className="chat-display" autoHide={false}>
          {reqInfo && (
            <ChatDisplay
              {...{
                msgsByState,
                isClient: reqInfo?.isClient as boolean | undefined,
              }}
              getFileMsg={service.getFileByStateAndId}
              fromShowConversations
              titleNoMsgsYetHint={noMsgsYetHint(reqInfo?.isClient)}
            />
          )}
        </SimpleBar>
        <div className="show-conversations-btn-wrapper">
          <Button
            label="بازگشت"
            onClick={() => {
              setOpen(false);
            }}
            color="blue"
            size={matchesSm ? "xs" : "sm"}
          />
        </div>
      </Popup>
    </>
  );
}

export default ShowConversations;
