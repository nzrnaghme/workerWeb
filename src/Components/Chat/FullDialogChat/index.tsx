import { useEffect, useRef, useState } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import Chat from "../Chat";
import Button from "../../Button";
import FullDialog from "../../FullDialog";
import { toPersianNumber } from "../../hooks/persianHelper";
import {
  IMessage,
  IMsgListened,
  IFileUploaded,
  IMsgsByState,
  IChatGlobalConfigs,
} from "../../../Models/Entities";
import { IUserLogin } from "../../../Providers/Entities";
import { MsgsState } from "../../../Models/Enums";
import { toast } from "react-toastify";

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
  setConnection: (connection: signalR.HubConnection | undefined) => void;
  callInitializer: () => void;
};

const msg21 =
  "برای استفاده از این امکان ابتدا باید دکمه شروع گفتگو را کلیک نمایید.";

function FullDialogChat({
  receiverId,
  isClient,
  reqId,
  connection,
  userLogin,
  postFileMsg,
  chatGlobalConfigs,
  previousMessage,
  state,
  disabled,
  clientId,
  servantId,
  shouldDisabled,
  callInitializer,
  setConnection,
}: Props) {
  const matchesSm = useMediaQuery("(max-width:40rem)");
  const [openChatDialog, setOpenChatDialog] = useState(false);
  const openChatRef = useRef(false);
  const [msgsByState, setMsgsByState] = useState<IMsgsByState[] | []>(
    previousMessage
  );
  const msgsByStateRef = useRef<IMsgsByState[] | []>([]);
  const [newMsgsCounter, setNewMsgsCounter] = useState(0);
  const openPopUp = useRef(openChatDialog);

  useEffect(() => {
    window.addEventListener("popstate", (event) => {
      if (openPopUp.current) {
        openPopUp.current = false;
        window.history.go(1);
      }
    });
  }, [openPopUp.current]);

  useEffect(() => {
    openChatRef.current = openChatDialog;
    if (openChatDialog) {
      openPopUp.current = true;
      callInitializer();
    } else openPopUp.current = false;
  }, [openChatDialog]);

  useEffect(() => {
    setMsgsByState(previousMessage);
  }, [previousMessage]);

  useEffect(() => {
    if (!connection) return;

    connection.on("DeleteMessage", (reqWorkingMessageId: string) => {
      let finalMessage = msgsByStateRef.current.map((c: IMsgsByState) => ({
        state: c.state,
        messages: c.messages.filter((i) => i.id !== reqWorkingMessageId),
      }));
      setMsgsByState(finalMessage);
    });

    connection.on(
      "ReceiveMessage",
      ({
        date,
        id,
        message,
        fileMessage,
        sendDate,
        isRecieved,
        isMine,
        requestId,
      }: IMsgListened) => {
        if (requestId !== reqId) return;

        let newMessage: IMessage = {
          date: date,
          id: id,
          message: message,
          fileMessage: fileMessage,
          isMine: isMine,
          sendDate: sendDate,
          isReceived: isRecieved,
        };

        let s = msgsByStateRef.current.find((c) => c.state === state);

        if (s) {
          (s.messages as IMessage[]).push(newMessage);
        } else {
          let confirm = {
            state: state,
            messages: [newMessage],
          };
          (msgsByStateRef.current as IMsgsByState[]).push(
            confirm as IMsgsByState
          );
        }

        let newMsgsByState: IMsgsByState[] = [];
        msgsByStateRef.current.map((c) => newMsgsByState.push(c));

        setMsgsByState(newMsgsByState);

        if (!isMine && !openChatRef.current) {
          setNewMsgsCounter((prevS) => prevS + 1);
        }
      }
    );
  }, [connection, shouldDisabled]);

  const closeFullChatDialog = () => {
    setOpenChatDialog(false);
    // disconnectOnFullDialogClosed();
  };

  // Seems to be wrong!
  // const disconnectOnFullDialogClosed = () => {
  // connection!.stop().catch(console.log);
  // setConnection(undefined);
  // };

  const chatOpenBtnLabel = () => {
    let label = "ارسال پیام...";
    if (newMsgsCounter !== 0)
      label = label + `(${toPersianNumber(newMsgsCounter)})`;
    return label;
  };

  const openChatFullDialog = () => {
    if (!shouldDisabled) setOpenChatDialog(true);
    else toast.info(msg21);
    // newMsgsIds.current = [];
    if (newMsgsCounter > 0) setNewMsgsCounter(0);
  };

  const chatComponent = (
    <Chat
      {...{
        reqId,
        userLogin,
        connection,
        isClient,
        receiverId,
        postFileMsg,
        chatGlobalConfigs,
        previousMessage,
        state,
        clientId,
        servantId,
        setNewMsgsCounter,
        newMsgsCounter,
        disabled,
        shouldDisabled,
        msgsByState,
        msgsByStateRef,
      }}
    />
  );

  return (
    <>
      <FullDialog
        label="گفتگو"
        open={openChatDialog}
        onCancel={closeFullChatDialog}
      >
        {chatComponent}
      </FullDialog>
      {matchesSm ? (
        <Button
          label={chatOpenBtnLabel()}
          onClick={openChatFullDialog}
          className="chat-fulldialog-btn"
          startIcon={<FontAwesomeIcon icon={faComments} />}
        />
      ) : (
        chatComponent
      )}
    </>
  );
}

export default FullDialogChat;
