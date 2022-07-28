import NotificationGrid from "./NotificationGrid";
import { INotificationList } from "../Entites";
import Popup from "../../../Components/Popup";
import Divider from "@material-ui/core/Divider";
import Button from "../../../Components/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";

type props = {
  items: INotificationList[];
  open: boolean;
  onClose: () => void;
  closeFormNotification: () => void;
  onReadNotification: (notificationId: string) => void;
};

function NotificationPopUp({
  items,
  open,
  onClose,
  onReadNotification,
  closeFormNotification,
}: props) {
  const matchesSm = useMediaQuery("(max-width:40rem)");

  return (
    <Popup {...{ open, onClose }} className="profile-comments-popup">
      <p className="profile-comments-popup-title">پیام های سیستمی</p>
      <Divider className="profile-comments-divider" />
      <NotificationGrid
        {...{ items }}
        onReadNotification={(notificationId: string) => {
          onReadNotification(notificationId);
        }}
      />
      <div className="notification-popup-btn-wrapper">
        <Button
          label="بازگشت"
          className="more-info-btn"
          onClick={closeFormNotification}
          color="blue"
          variant="outlined"
          size={matchesSm ? "xs" : "sm"}
        />
      </div>
    </Popup>
  );
}
export default NotificationPopUp;
