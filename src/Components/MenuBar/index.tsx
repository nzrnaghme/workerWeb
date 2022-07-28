import React, { useEffect, useRef, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import Toolbar from "@material-ui/core/Toolbar";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import "./index.scss";
import Avatar from "../Avatar/Avatar";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faTimes } from "@fortawesome/free-solid-svg-icons";
import CurrentServant from "./pic/CurrentServant.svg";
import CurrentRequest from "./pic/MyCurrentRequest.svg";
import MyRequestList from "./pic/MyRequestList.svg";
import TransactionWallet from "./pic/TransactionWallet.svg";
import IncreaseWallet from "./pic/IncreaseWallet.svg";
import Paper from "../Paper";
import Exit from "./pic/Exit.svg";
import MyServantList from "./pic/MyServantList.svg";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { AppBar } from "@material-ui/core";
import { showLocalStorage } from "../../Routers/localStorage";
import * as service from "../../Header/Service";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TransitionPc = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="right" ref={ref} {...props} />;
});

type Props = {
  open: boolean;
  close: () => void;
  logoutClick: () => void;
};

export default function MenuBar({ open, close, logoutClick }: Props) {
  const isMobileView = useMediaQuery("(max-width: 40rem)");
  const history = useHistory();
  const FullNameUser = useRef<string>("");
  const storageUser = showLocalStorage("user");
  const [pictureUser, setPictureUser] = useState("");
  const openPopUp = useRef(open);

  useEffect(() => {
    if (storageUser?.Id) {
      handleShowProfile(storageUser.Id);
    }
    if (open) {
      openPopUp.current = true;
    } else openPopUp.current = false;
  }, [open]);

  useEffect(() => {
    window.addEventListener("popstate", (event) => {
      if (openPopUp.current) {
        openPopUp.current = false;
        close();
        window.history.go(1);
      }
    });
  }, [openPopUp.current]);

  const handleShowProfile = async (id: string) => {
    const info = await service.GetUserProfileInfo(id);
    if (info.Error != null) return;
    FullNameUser.current = info.Data.firstName + " " + info.Data.lastName;
    setPictureUser(info.Data.picture);
  };

  return isMobileView ? (
    <Dialog
      fullScreen
      open={open}
      onClose={close}
      TransitionComponent={Transition}
      style={{ minWidth: "280px" }}
    >
      <AppBar className="fullscreen-menu-bar">
        <Toolbar>
          <FontAwesomeIcon
            style={{
              fontSize: "1.7rem",
              color: "rgb(33, 33, 33)",
              cursor: "pointer",
            }}
            icon={faTimes}
            onClick={close}
          />
        </Toolbar>
      </AppBar>

      <div className="form-menu-Bar">
        <Paper className="paper-menu-bar">
          <div
            className="user-menu-Bar"
            onClick={() => {
              close();
              history.push("/Profile");
            }}
          >
            <h4 className="title-profile">
              {FullNameUser.current ? FullNameUser.current : ""}
            </h4>
            <h4 className="icon-move-user-menu-Bar">
              <Avatar avatarSize={3} src={pictureUser ? pictureUser : ""} />
              <FontAwesomeIcon
                style={{
                  fontSize: "1.2rem",
                  color: "rgb(142, 142, 142)",
                  marginTop: "5px",
                }}
                icon={faAngleLeft}
                onClick={() => {
                  close();
                  history.push("/Profile");
                }}
              />
            </h4>
          </div>
        </Paper>
        <Paper className="paper-menu-bar">
          <div
            className="user-menu-Bar"
            onClick={() => {
              close();
              history.push("/MyCurrentRequestList");
            }}
          >
            <h4 className="icon-user-menu-Bar">
              <img src={CurrentRequest} className="img-tick-request" />
              <p>درخواست های فعال من</p>
            </h4>
            <h4 className="icon-move-user-menu-Bar">
              <FontAwesomeIcon
                style={{
                  fontSize: "1.2rem",
                  color: "rgb(142, 142, 142)",
                  marginTop: "5px",
                }}
                icon={faAngleLeft}
              />
            </h4>
          </div>
          <div
            className="user-menu-Bar"
            onClick={() => {
              close();
              history.push("/MyRequestList");
            }}
          >
            <h4 className="icon-user-menu-Bar">
              <img
                className="img-withOut-tick-request"
                src={MyRequestList}
                width="8% !important"
              />
              <p>درخواست های من</p>
            </h4>
            <h4 className="icon-move-user-menu-Bar">
              <FontAwesomeIcon
                style={{
                  fontSize: "1.2rem",
                  color: "rgb(142, 142, 142)",
                  marginTop: "5px",
                }}
                icon={faAngleLeft}
              />
            </h4>
          </div>
          <div
            className="user-menu-Bar"
            onClick={() => {
              close();
              history.push("/MyCurrentServantRequest");
            }}
          >
            <h4 className="icon-user-menu-Bar">
              <img src={CurrentServant} className="img-tick" />
              <p> خدمات فعال من</p>
            </h4>
            <h4 className="icon-move-user-menu-Bar">
              <FontAwesomeIcon
                style={{
                  fontSize: "1.2rem",
                  color: "rgb(142, 142, 142)",
                  marginTop: "5px",
                }}
                icon={faAngleLeft}
              />
            </h4>
          </div>
          <div
            className="user-menu-Bar"
            onClick={() => {
              close();
              history.push("/MyServantRequest");
            }}
          >
            <h4 className="icon-user-menu-Bar">
              <img src={MyServantList} className="img-withOut-tick-servant" />
              <p>خدمات من</p>
            </h4>
            <h4 className="icon-move-user-menu-Bar">
              <FontAwesomeIcon
                style={{
                  fontSize: "1.2rem",
                  color: "rgb(142, 142, 142)",
                  marginTop: "5px",
                }}
                icon={faAngleLeft}
              />
            </h4>
          </div>
        </Paper>
        <Paper className="paper-menu-bar">
          <div
            className="user-menu-Bar"
            onClick={() => {
              close();
              history.push("/WalletTransaction");
            }}
          >
            <h4 className="icon-user-menu-Bar">
              <img
                src={TransactionWallet}
                className="img-withOut-tick-wallet"
              />
              <p>تراکنش های کیف پول</p>
            </h4>
            <h4 className="icon-move-user-menu-Bar">
              <FontAwesomeIcon
                style={{
                  fontSize: "1.2rem",
                  color: "rgb(142, 142, 142)",
                  marginTop: "5px",
                }}
                icon={faAngleLeft}
              />
            </h4>
          </div>
          <div
            className="user-menu-Bar"
            onClick={() => {
              close();
              history.push("/IncreaseWallet");
            }}
          >
            <h4 className="icon-user-menu-Bar">
              <img src={IncreaseWallet} className="img-tick" />
              <p>شارژ کیف پول</p>
            </h4>
            <h4 className="icon-move-user-menu-Bar">
              <FontAwesomeIcon
                style={{
                  fontSize: "1.2rem",
                  color: "rgb(142, 142, 142)",
                  marginTop: "5px",
                }}
                icon={faAngleLeft}
              />
            </h4>
          </div>
        </Paper>
        <Paper className={"paper-menu-bar"}>
          <div
            className="user-menu-Bar"
            onClick={() => {
              close();
              logoutClick();
            }}
          >
            <h4 className="icon-user-menu-Bar">
              <img src={Exit} className="img-tick" />
              <p>خروج از حساب کاربری</p>
            </h4>
          </div>
        </Paper>
      </div>
    </Dialog>
  ) : (
    <Dialog
      fullScreen
      open={open}
      onClose={close}
      TransitionComponent={TransitionPc}
      style={{ width: "20%", minWidth: "300px" }}
    >
      <AppBar className="fullscreen-menu-bar-pc">
        <Toolbar>
          <FontAwesomeIcon
            style={{
              fontSize: "1.7rem",
              color: "rgb(33, 33, 33)",
              marginTop: "5px",
              cursor: "pointer",
            }}
            icon={faTimes}
            onClick={close}
          />
        </Toolbar>
      </AppBar>

      <div className="form-menu-Bar">
        <Paper className="paper-menu-bar">
          <div
            className="user-menu-Bar"
            onClick={() => {
              close();
              history.push("/Profile");
            }}
          >
            <h4 className="title-profile">
              {FullNameUser.current ? FullNameUser.current : ""}
            </h4>
            <h4 className="icon-move-user-menu-Bar">
              <Avatar avatarSize={3} src={pictureUser ? pictureUser : ""} />
              <FontAwesomeIcon
                style={{
                  fontSize: "1.2rem",
                  color: "rgb(142, 142, 142)",
                  marginTop: "5px",
                }}
                icon={faAngleLeft}
                onClick={() => {
                  close();
                  history.push("/Profile");
                }}
              />
            </h4>
          </div>
        </Paper>
        <Paper className="paper-menu-bar">
          <div
            className="user-menu-Bar"
            onClick={() => {
              close();
              history.push("/MyCurrentRequestList");
            }}
          >
            <h4 className="icon-user-menu-Bar">
              <img src={CurrentRequest} className="img-tick-request" />
              <p>درخواست های فعال من</p>
            </h4>
            <h4 className="icon-move-user-menu-Bar">
              <FontAwesomeIcon
                style={{
                  fontSize: "1.2rem",
                  color: "rgb(142, 142, 142)",
                  marginTop: "5px",
                }}
                icon={faAngleLeft}
              />
            </h4>
          </div>
          <div
            className="user-menu-Bar"
            onClick={() => {
              close();
              history.push("/MyRequestList");
            }}
          >
            <h4 className="icon-user-menu-Bar">
              <img
                className="img-withOut-tick-request"
                src={MyRequestList}
                width="8% !important"
              />
              <p>درخواست های من</p>
            </h4>
            <h4 className="icon-move-user-menu-Bar">
              <FontAwesomeIcon
                style={{
                  fontSize: "1.2rem",
                  color: "rgb(142, 142, 142)",
                  marginTop: "5px",
                }}
                icon={faAngleLeft}
              />
            </h4>
          </div>
          <div
            className="user-menu-Bar"
            onClick={() => {
              close();
              history.push("/MyCurrentServantRequest");
            }}
          >
            <h4 className="icon-user-menu-Bar">
              <img src={CurrentServant} className="img-tick" />
              <p> خدمات فعال من</p>
            </h4>
            <h4 className="icon-move-user-menu-Bar">
              <FontAwesomeIcon
                style={{
                  fontSize: "1.2rem",
                  color: "rgb(142, 142, 142)",
                  marginTop: "5px",
                }}
                icon={faAngleLeft}
              />
            </h4>
          </div>
          <div
            className="user-menu-Bar"
            onClick={() => {
              close();
              history.push("/MyServantRequest");
            }}
          >
            <h4 className="icon-user-menu-Bar">
              <img src={MyServantList} className="img-withOut-tick-servant" />
              <p>خدمات من</p>
            </h4>
            <h4 className="icon-move-user-menu-Bar">
              <FontAwesomeIcon
                style={{
                  fontSize: "1.2rem",
                  color: "rgb(142, 142, 142)",
                  marginTop: "5px",
                }}
                icon={faAngleLeft}
              />
            </h4>
          </div>
        </Paper>
        <Paper className="paper-menu-bar">
          <div
            className="user-menu-Bar"
            onClick={() => {
              close();
              history.push("/WalletTransaction");
            }}
          >
            <h4 className="icon-user-menu-Bar">
              <img
                src={TransactionWallet}
                className="img-withOut-tick-wallet"
              />
              <p>تراکنش های کیف پول</p>
            </h4>
            <h4 className="icon-move-user-menu-Bar">
              <FontAwesomeIcon
                style={{
                  fontSize: "1.2rem",
                  color: "rgb(142, 142, 142)",
                  marginTop: "5px",
                }}
                icon={faAngleLeft}
              />
            </h4>
          </div>
          <div
            className="user-menu-Bar"
            onClick={() => {
              close();
              history.push("/IncreaseWallet");
            }}
          >
            <h4 className="icon-user-menu-Bar">
              <img src={IncreaseWallet} className="img-tick" />
              <p>شارژ کیف پول</p>
            </h4>
            <h4 className="icon-move-user-menu-Bar">
              <FontAwesomeIcon
                style={{
                  fontSize: "1.2rem",
                  color: "rgb(142, 142, 142)",
                  marginTop: "5px",
                }}
                icon={faAngleLeft}
              />
            </h4>
          </div>
        </Paper>
        <Paper className={"paper-menu-bar"}>
          <div
            className="user-menu-Bar"
            onClick={() => {
              close();
              logoutClick();
            }}
          >
            <h4 className="icon-user-menu-Bar">
              <img src={Exit} className="img-tick" />
              <p>خروج از حساب کاربری</p>
            </h4>
          </div>
        </Paper>
      </div>
    </Dialog>
  );
}
