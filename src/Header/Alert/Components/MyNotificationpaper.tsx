import { toPersianNumber } from "../../../Components/hooks/persianHelper";
import { INotificationList } from "../Entites";
import Button from "../../../Components/Button";
import "./index.scss";

type Props = {
  item: INotificationList;
  onReadNotification: (notificationId: string) => void;
};

function MyNotificationPaper({ item, onReadNotification }: Props) {
  const formatDateTime = () => item.sendDate.split(" ").reverse().join(" - ");

  return (
    <div className="notification">
      <div className="notification-date-wrapper">
        <span>زمان ارسال:</span>
        <span className="notification-date">
          {toPersianNumber(formatDateTime())}
        </span>
      </div>
      <div className="notification-caption-btn-wrapper">
        <p className="notification-caption">
          {toPersianNumber(item.description)}
        </p>
        <Button
          label="متوجه شدم"
          onClick={() => {
            onReadNotification(item.id);
          }}
        />
      </div>
    </div>
  );
}

export default MyNotificationPaper;
