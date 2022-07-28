import ShowComments from "../../../../../../Components/ShowComments";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Popup from "../../../../../../Components/Popup";
import { MyComments } from "../../../../../../Components/ShowComments/Entities";
import Divider from "@material-ui/core/Divider";
import "./index.scss";

type Props = {
  open: boolean;
  onClose: () => void;
  items: MyComments[]; //TODO: Context API needed: This has handed over so many components.
};

function CommentsPopup({ open, onClose, items }: Props) {
  return (
    <Popup {...{ open, onClose }} className="profile-comments-popup">
      <FontAwesomeIcon
        icon={faTimes}
        className="profile-comments-popup-close-btn"
        onClick={onClose}
      />
      <p className="profile-comments-popup-title">نظرات کاربران</p>
      <Divider className="profile-comments-divider" />
      <ShowComments {...{ items }} />
    </Popup>
  );
}

export default CommentsPopup;
