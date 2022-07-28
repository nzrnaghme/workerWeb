import "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  icon?: any;
  color?: string; // Colors part going to be developed.
  title?: string;
};

const RequestStatusform = ({ icon, title, color }: Props) => {
  return (
    <div className="req-paper-status">
      <div className="req-paper-status-icon-wrapper">
        <FontAwesomeIcon icon={icon}/>
      </div>
      <p className="req-paper-status-title">{title}</p>
    </div>
  );
};

export default RequestStatusform;
