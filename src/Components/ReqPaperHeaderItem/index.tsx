import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Divider from "@material-ui/core/Divider";
import "./index.scss";

type Props = {
  icon: any;
  iconClassName?: string;
  children: React.ReactNode;
};

const HeaderItem = ({ icon, children, iconClassName }: Props) => (
  <div className="req-paper-header-item">
    <FontAwesomeIcon icon={icon} className={iconClassName} />
    <Divider orientation="vertical" className="req-paper-verical-divider" />
    {children}
  </div>
);

export default HeaderItem;
