import { INotificationList } from "../Entites";
import SimpleBar from "simplebar-react";
import MyNotificationPaper from "./MyNotificationpaper";

type props = {
  items: INotificationList[];
  onReadNotification: (notificationId: string) => void;
};

function NotificationGrid({ items, onReadNotification }: props) {

  
  return (
    <SimpleBar autoHide={false} className="comments-section">
      <div>
        {items != null &&
          items.map((c) => (
            <MyNotificationPaper
              item={c}
              onReadNotification={() => {
                onReadNotification(c.id);
              }}
            />
          ))}
      </div>
    </SimpleBar>
  );
}

export default NotificationGrid;
