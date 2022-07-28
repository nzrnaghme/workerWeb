import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import "./index.scss";
import useSignalR from "../../Components/hooks/useSignalR";
import { showLocalStorage } from "../../Routers/localStorage";
import { UserApiUrl } from "../../config";
import { toPersianNumber } from "../../Components/hooks/persianHelper";
import NotificationPopUp from "./Components/NotificationPopUp";
import { INotificationList } from "./Entites";
import Badge from "@material-ui/core/Badge";
import * as service from "./IServices";

function PushNotifications() {
  const connectionInstanceMaker = useSignalR();
  const [connection, setConnection] = useState<signalR.HubConnection>();
  const [isConnected, setIsConnected] = useState(false);
  const [numberOfNotification, setNumberOfNotification] = useState(Number);
  const [showNotifications, setShowNotifications] = useState(false);
  const [items, setItems] = useState<INotificationList[]>([]);
  const storageUser = showLocalStorage("user");

  useEffect(() => {
    if (storageUser && !isConnected) {
      onConnectionInstanceResolved();
    }
  }, []);

  useEffect(() => {
    if (storageUser && isConnected) {
      connection?.on("Notification", (numberNotification: number) => {

        setNumberOfNotification(numberNotification);
      });
    }
  }, [isConnected]);

  const onConnectionInstanceResolved = async () => {
    if (connection === null || connection === undefined) {
      const instance = await connectionInstanceMaker(
        storageUser.AccessToken,
        setIsConnected,
        UserApiUrl + "UserHub"
      );
      setConnection(instance);
    }
  };

  const getAllNotifications = async () => {
    setItems([]);
    const res = await service.getUserNotification(storageUser.Id);
    setItems(res.Data);
    setShowNotifications(true);
  };

  const onReadNotification = async (notificationId: string) => {
    const res = await service.putViewedNotification(notificationId);
    if (res.Data === undefined) {
      if (items.length === 1) setShowNotifications(false);
      setItems((prevS) => {
        return prevS.filter((i) => i.id !== notificationId);
      });
      setNumberOfNotification(numberOfNotification - 1);
    }
  };

  return (
    <>
      {numberOfNotification === 0 ||
      numberOfNotification < 0 ||
      !storageUser ? (
        <FontAwesomeIcon icon={faBell} className="header-bell-none-notif" />
      ) : (
        <>
          <Badge
            badgeContent={toPersianNumber(numberOfNotification)}
            color="primary"
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            className="notification-badge"
            onClick={() => {
              getAllNotifications();
            }}
          >
            <FontAwesomeIcon icon={faBell} className="header-bell" />
          </Badge>
        </>
      )}
      <NotificationPopUp
        items={items}
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
        onReadNotification={(notificationId: string) => {
          onReadNotification(notificationId);
        }}
        closeFormNotification={() => {
          setShowNotifications(false);
        }}
      />
    </>
  );
}

export default PushNotifications;
