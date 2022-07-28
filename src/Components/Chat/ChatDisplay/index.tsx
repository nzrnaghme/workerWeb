import { useEffect } from "react";
import { IMessage, IMsgsByState } from "../../../Models/Entities";
import { TextMessage, FileMessage, NoMessageHint } from "./Message";
import { MsgsState } from "../../../Models/Enums";

type Props = {
  msgsByState: IMsgsByState[] | [] | undefined;
  fromShowConversations?: boolean;
  connection: signalR.HubConnection;
  clientId?: string;
  servantId?: string;
  call: (msg: IMessage) => void;
  state: MsgsState;
  titleNoMsgsYetHint: string;
};

function ChatDisplay({
  msgsByState,
  fromShowConversations,
  connection,
  clientId,
  servantId,
  call,
  state,
  titleNoMsgsYetHint,
}: Props) {
  const stateLabelMaker = (state: MsgsState) => {
    switch (state) {
      case MsgsState.RequestConfirm:
        return "تایید درخواست";
      case MsgsState.RequestWaiting:
        return "انتظار تا رسیدن";
      case MsgsState.RequestWorking:
        return "شروع کار";
    }
  };

  const MsgsListMaker = (lMsg: IMsgsByState) => {
    let fileIdName = 1;

    return lMsg.messages?.map((msg) => {
      if (msg.fileMessage.fileType === null) {
        return <TextMessage key={msg.id} {...{ msg }} />;
      } else {
        msg.fileMessage.name = (fileIdName++).toString();
        return (
          <FileMessage
            call={(msg: IMessage) => call(msg)}
            connection={connection!}
            key={msg.id}
            msgsState={lMsg.state}
            state={state}
            {...{ msg, clientId, servantId }}
            fromShowConversations={fromShowConversations ?? false}
          />
        );
      }
    });
  };

  return (
    <>
      {msgsByState != null &&
      (msgsByState[0] === undefined || msgsByState[0].messages.length === 0) ? (
        <NoMessageHint hint={titleNoMsgsYetHint} />
      ) : (
        msgsByState?.map((lMsg) => (
          <>
            <p className="MsgsStateLabel" key={lMsg.state}>
              {stateLabelMaker(lMsg.state)}
            </p>
            {MsgsListMaker(lMsg)}
          </>
        ))
      )}
    </>
  );
}

export default ChatDisplay;
