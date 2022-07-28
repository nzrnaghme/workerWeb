import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./index.scss";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Divider from "@material-ui/core/Divider";
import ButtonBase from "@material-ui/core/ButtonBase";
import Container from "../Components/Container";
import Button from "../Components/Button";
import logo from "../Images/root/Logo.png";
import bareLogo from "../Images/bare-logo.png";
import emergent from "../Images/root/Banner-Fori-Web.png";
import suggested from "../Images/root/Banner-Pishnahadi-Web.png";
import daily from "../Images/root/Banner-Rozmare-Web.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { useGeneralContext } from "../Providers/GeneralContext";
import { toast } from "react-toastify";
import * as service from "./Service";
import { removeLocalStorage, showLocalStorage } from "../Routers/localStorage";
import PushNotifications from "./Alert";
import { ProfileImageAndState } from "../Registers/Requests/AddRequest/Entities";
import MenuBar from "../Components/MenuBar";
import Navigation from "../Components/Navigation";

const msg6 = "عکس پروفایل شما تایید و یا ثبت نشده است";
const msg12 = "لطفا در پروفایل خود استان را وارد کنید.";
const msg13 =
  "عکس پروفایل شما تایید و یا ثبت نشده است، استان در پروفایل وارد نشده است.";

function Header() {
  const isMobileView = useMediaQuery("(max-width: 40rem)");
  const storageUser = showLocalStorage("user");
  const history = useHistory();
  const [detailUser, setDetailUser] = useState<boolean>(false);
  const { onConfirmSetter, setConfirmPopupOpen } = useGeneralContext();

  const [open, setOpen] = useState(false);
  const [showInsertRequest, setShowInsertRequest] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      if (storageUser?.Id) {
        setDetailUser(true);
        return;
      }
    }
    setDetailUser(false);
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") {
      setShowInsertRequest(true);
    } else setShowInsertRequest(false);
  }, [location]);

  const checkImageAndState = async () => {
    if (storageUser && storageUser.Id) {
      const res = await service.hasUserPictureAndState(storageUser.Id);
      if (res.Error != null) return;
      switch (res.Data) {
        case ProfileImageAndState.HasNotImage:
          toast.warning(msg6);
          break;
        case ProfileImageAndState.HasNotState:
          toast.warning(msg12);
          break;
        case ProfileImageAndState.HasNotImageAndState:
          toast.warning(msg13);
          break;
        case ProfileImageAndState.HasImageAndState:
          history.push("/AddRequest");
          break;
      }
    } else history.push("/Login");
  };

  const isLogin = detailUser && storageUser;

  type MobileHeaderProps = {
    showFullLogo: boolean;
  };

  const MobileHeader = ({ showFullLogo }: MobileHeaderProps) => (
    <header className="mobile-header">
      <div className="mobile-header-items">
        <div className="logo-navigation-wrapper">
          <div
            className={`${
              showFullLogo ? "full-logo-wrapper-mobile" : "logo-wrapper-mobile"
            }`}
          >
            <Link to="/">
              {showFullLogo ? (
                <img src={logo} alt="" />
              ) : (
                <img src={bareLogo} alt="" />
              )}
            </Link>
          </div>

          <Navigation />
        </div>
        <div className="mobile-header-actions">
          <PushNotifications />
          {showInsertRequest && storageUser && (
            <Button
              label="درخواست جدید"
              size="sm"
              color="blue"
              startIcon={<FontAwesomeIcon icon={faPlus} />}
              onClick={() => {
                checkImageAndState();
              }}
            />
          )}
          {!isLogin && (
            <ButtonBase
              className="mobile-header-entry-btn"
              onClick={handleLogin}
            >
              ورود
            </ButtonBase>
          )}
          {isLogin && (
            <ButtonBase
              style={{
                height: "1rem",
                width: "1rem",
                borderRadius: "50%",
                marginBottom: "0.25rem",
              }}
              onClick={() => {
                setOpen((p) => !p);
              }}
            >
              <FontAwesomeIcon
                style={{
                  fontSize: "1.2rem",
                  color: "#00707e",
                  cursor: "pointer",
                }}
                icon={faEllipsisV}
              />
            </ButtonBase>
          )}
        </div>
        {open && (
          <MenuBar
            open={open}
            logoutClick={logoutClick}
            close={() => {
              setOpen(false);
            }}
          />
        )}
      </div>
    </header>
  );

  const logoutClick = () => {
    onConfirmSetter("آیا می‌خواهید از حساب کاربری‌تان خارج شوید؟", () => {
      setOpen(false);
      removeLocalStorage("user");
      toast.success("عملیات خروج با موفقیت انجام شد");
      history.push("/");
      setDetailUser(false);
    });

    setConfirmPopupOpen(true);
  };

  const handleLogin = () => {
    history.push("/Login");
  };
  const showFullLogo = () => {
    const fullLogoPaths = [
      "/",
      "/Login",
      "/about-us",
      "/frequently-asked-questions",
      "/rules",
      "/privacy",
      "/suggestions",
      "/why-yootaab",
      "/usage-guide",
      "/secure-usage-guide",
    ];

    if (fullLogoPaths.includes(location.pathname)) return true;
    else return false;
  };

  return isMobileView ? (
    <MobileHeader showFullLogo={showFullLogo()} />
  ) : (
    <header className="our-header">
      <Container className="logo-btn-container">
        <div className="logo-navigation-wrapper">
          <div
            className={`${
              showFullLogo() ? "full-logo-wrapper" : "logo-wrapper"
            }`}
          >
            <Link to="/">
              {showFullLogo() ? (
                <img src={logo} alt="" />
              ) : (
                <img src={bareLogo} alt="" />
              )}
            </Link>
          </div>
          <Navigation />
        </div>

        <div className="header-btns-wrapper">
          <div className="desktop-header-actions">
            <PushNotifications />
            <Button
              label="درخواست جدید"
              size="lg"
              color="blue"
              startIcon={<FontAwesomeIcon icon={faPlus} />}
              onClick={() => {
                checkImageAndState();
              }}
            />
            {!isLogin && (
              <ButtonBase
                className="desktop-header-entry-btn"
                onClick={handleLogin}
              >
                ورود
              </ButtonBase>
            )}
            {isLogin && (
              <ButtonBase
                style={{
                  height: "1rem",
                  width: "1rem",
                  borderRadius: "50%",
                  marginBottom: "0.25rem",
                }}
                onClick={() => {
                  setOpen((p) => !p);
                }}
              >
                <FontAwesomeIcon
                  style={{
                    fontSize: "1.5rem",
                    color: "#00707e",
                    cursor: "pointer",
                  }}
                  icon={faEllipsisV}
                />
              </ButtonBase>
            )}
          </div>
          {open && (
            <MenuBar
              open={open}
              logoutClick={logoutClick}
              close={() => {
                setOpen(false);
              }}
            />
          )}
        </div>
      </Container>
      <Divider className="header-divider" />
      <Container className="header-banners-container">
        <div className="header-slogan">
          <p>
            <strong>ای‌رول</strong>، همیار شما در مشکلات روزمره
          </p>
          <p>
            با ثبت رایگان درخواست ها و ارتباط مستقیم با همیاران در ای‌رول، در
            سریع ترین زمان نزدیکترین همیار را برای حل مشکلات روزمره خود بیابید.
          </p>
        </div>
        <div className="header-banners">
          <Link to="/RequestList/emergancy">
            <ButtonBase className="link-img-btn-wrapper">
              <img src={emergent} alt="" />
            </ButtonBase>
          </Link>
          <Link to="/RequestList/suggest">
            <ButtonBase className="link-img-btn-wrapper">
              <img src={suggested} alt="" />
            </ButtonBase>
          </Link>
          <Link to="/RequestList">
            <ButtonBase className="link-img-btn-wrapper">
              <img src={daily} alt="" />
            </ButtonBase>
          </Link>
        </div>
      </Container>
    </header>
  );
}

export default Header;
