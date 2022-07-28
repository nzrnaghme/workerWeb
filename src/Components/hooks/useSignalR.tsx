import * as signalR from "@microsoft/signalr";
import { toast } from "react-toastify";

const useConnection = () => {
  const connectionInstanceMaker = async (
    token: string,
    setIsConnected: React.Dispatch<React.SetStateAction<boolean>>,
    url: string
  ) => {
    if (!token) return;

    function getRandomArbitrary(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const connectionInstance = await new signalR.HubConnectionBuilder()
      .withUrl(url, {
        accessTokenFactory: () => token,
      })

      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    connectionInstance
      .start()

      .then(function () {
        setIsConnected(true);
      })
      .catch(function (err) {
        // console.log("errSignalaR: " + err);
      });

    connectionInstance.onreconnecting((c) => {});

    return connectionInstance;
  };

  return connectionInstanceMaker;
};

export default useConnection;
