import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "./Chat.scss";
import { FileType, MsgsState } from "../../Models/Enums";

import Paper from "../Paper";
import { IUserLogin } from "../../Providers/Entities";
import ChatDisplay from "./ChatDisplay";
import ChatControls from "./ChatControls";
import {
  IMessage,
  IMsgListened,
  IMsgSended,
  IFileUploaded,
  IMsgsByState,
  IChatGlobalConfigs,
} from "../../Models/Entities";
import SimpleBar from "simplebar-react";
import moment from "moment";

//just confirm
const msg21 =
  "برای استفاده از این امکان ابتدا باید دکمه شروع گفتگو را کلیک نمایید.";

const noMsgsYetHint = (isClient: boolean) =>
  `در این قسمت می توانید با ${
    isClient ? "همیار" : "درخواست دهنده"
  } گفتگو کنید.`;

type Props = {
  connection: signalR.HubConnection;
  isClient: boolean;
  reqId: string;
  receiverId: string;
  userLogin: IUserLogin;
  postFileMsg: (data: IFileUploaded) => any;
  chatGlobalConfigs: IChatGlobalConfigs;
  previousMessage: IMsgsByState[] | [];
  state: MsgsState;
  disabled?: boolean;
  clientId?: string;
  servantId?: string;
  shouldDisabled?: boolean | undefined;
  msgsByState: IMsgsByState[] | [];
  msgsByStateRef: any;
};

function Chat({
  receiverId,
  isClient,
  reqId,
  connection,
  userLogin,
  postFileMsg,
  chatGlobalConfigs,
  state,
  disabled,
  clientId,
  servantId,
  shouldDisabled,
  msgsByState,
  msgsByStateRef,
}: Props) {
  const localReqId = useRef<string | undefined>();

  const scrollableNode = useRef<HTMLElement>(null);
  const scrollDestination = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reqId !== "" && reqId !== undefined) {
      localReqId.current = reqId;
    }
  }, [reqId]);

  //TODO: RequestUserId is sent by the server but not needed. May be deleted later.

  useEffect(() => {
    msgsByStateRef.current = msgsByState;
  }, [msgsByState]);

  useEffect(() => {
    //TODO: Use this snippet for all mobile browsers
    const scrollable = scrollableNode.current!;
    scrollable.scrollTo({
      left: 0,
      top: scrollDestination.current!.offsetTop,
      behavior: "smooth",
    });

    //TODO: Use this for all desktop browsers except for Safari
    // scrollDestination.current!.scrollIntoView({
    //   behavior: "smooth",
    //   block: "nearest",
    // });
  }, [msgsByState]);

  const insertMsgInvoker = (
    text: string = "",
    id: string = "",
    dataFile: IFileUploaded | null = null
  ) => {
    const data: IMsgSended = {
      id,
      requestId: localReqId.current!,
      senderUserId: userLogin!.Id,
      receiverUserId: receiverId,
      sendDate: moment(new Date())
        .add(3, "hours")
        .add(30, "minutes")
        .toISOString(),
      message: text,
      fileMessage: dataFile
        ? {
            name: "",
            fileExtension: dataFile.fileExtension,
            fileSize: dataFile.fileSize,
            fileType: dataFile.fileType,
            content: "",
          }
        : null,
    };

    connection?.invoke("InsertMessage", data).catch((e: any) => {});
  };

  const onFileDelivered = async (
    file: string,
    fileType: FileType,
    fileExtension: string,
    fileSize: number
  ) => {
    const data: IFileUploaded = {
      requestId: reqId,
      senderUserId: userLogin?.Id,
      receiverUserId: receiverId,
      message: "", //To be deleted later!
      sendDate: null,
      file,
      fileType,
      fileExtension,
      fileSize,
    };
    const res = await postFileMsg(data);
    insertMsgInvoker(undefined, res.Data, data);
  };

  const deleteFileInChat = (msg: IMessage) => {
    connection
      ?.invoke("DeleteRequestMessage", clientId, servantId, msg.id)
      .catch((e: any) => {
        // console.log(e);
      })
      .then((c) => {
        if (c === false) {
          toast.warning("امکان حذف وجود ندارد.");
        }
      });
  };

  return (
    <Paper
      elevation={2}
      className="chat-paper"
      paperClicked={() => {
        if (shouldDisabled) toast.info(msg21);
      }}
    >
      <SimpleBar
        scrollableNodeProps={{ ref: scrollableNode }}
        className="chat-display"
        autoHide={false}
      >
        <ChatDisplay
          call={(msg: IMessage) => {
            deleteFileInChat(msg);
          }}
          {...{
            isClient,
            msgsByState,
            clientId,
            servantId,
          }}
          state={state}
          connection={connection!}
          titleNoMsgsYetHint={noMsgsYetHint(isClient)}
        />
        <div ref={scrollDestination} />
      </SimpleBar>
      <ChatControls
        {...{ onFileDelivered, insertMsgInvoker, disabled, chatGlobalConfigs }}
      />
    </Paper>
  );
}

export default Chat;
