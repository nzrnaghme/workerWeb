import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./IssueAndActions.scss";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Paper from "../../Components/Paper";
import Button from "../../Components/Button";
import Switch from "@material-ui/core/Switch";
import Popup from "../../Components/Modals/Popup";
import * as service from "../IService";
import { useGeneralContext } from "../../Providers/GeneralContext";
import { IUserLogin } from "../../Providers/Entities";
import { IConfirmReqWorking } from "../Entities";
import TextField from "../../Components/TextField";
import { toast } from "react-toastify";
import { IResult } from "../../Services/Entities";
import {
  toEnglishNumber,
  toPersianNumber,
} from "../../Components/hooks/persianHelper";
import { IMobileNos } from "../../RequestConfirm/Entities";
import AvatarName from "../components/AvatarName";
import { trackPromise } from "react-promise-tracker";

const msg1 = (duration: string, fullName: string) =>
  ` ${fullName} مدت ${toPersianNumber(
    duration
  )} را برای انجام کار تعیین کرده است، آیا تایید می کنید؟`;

const cancelMsgToMe =
  "با لغو درخواست مبلغ حق فسخ از کیف پول شما کسر می گردد و به کیف پول طرف مقابل اضافه می شود، آیا ادامه می دهید؟";
const msg6 = (fullname: string) =>
  `${fullname} درخواست را لغو کرده است، مبلغ حق فسخ به کیف پول شما اضافه می گردد.`;

const msg3 = (fullName: string) =>
  `${fullName} پایان کار را اعلام کرده است، آن را تایید می کنید؟`;

const securityReportHint =
  "بلافاصله پس از تایید به پشتیبانی اطلاع داده می شود.";

const msg5 = (fullName: string) => `${fullName} پایان کار را تایید نکرده است.`;

const msg7 = "آیا مطمئن هستید که شماره موبایل برای طرف مقابل نمایش داده شود؟";
const msg8 = "آیا مطمئن هستید که شماره موبایل برای طرف مقابل نمایش داده نشود؟";
const msg4 = (fullName: string) =>
  `${fullName} مدت زمان انجام کار را تایید نکرده است.`;

type Props = {
  connection: signalR.HubConnection;
  userLogin: IUserLogin;
  isPresence: boolean;
  isClient: boolean;
  audienceId: string;
  requestWorkingId: string;
  reqConfirmId: string;
  requestUserId: string;
  servantUserId: string;
  requestRegistrationId: string;
  mobileNos: IMobileNos;
  setMobileNos: (mobileNos: IMobileNos) => void;
  setShowAudienceInfo: (show: boolean) => void;
  setDurationPopup: (show: boolean) => void;
};

function IssueAndActions({
  connection,
  userLogin,
  isPresence,
  isClient,
  audienceId,
  requestWorkingId,
  reqConfirmId,
  requestUserId,
  servantUserId,
  requestRegistrationId,
  mobileNos,
  setMobileNos,
  setShowAudienceInfo,
  setDurationPopup,
}: Props) {
  const matchesSm = useMediaQuery("(max-width:40rem)");
  const history = useHistory();
  const { onConfirmSetter, setConfirmPopupOpen } = useGeneralContext();
  const [userInfo, setUserInfo] = useState({
    firstName: "نام",
    lastName: "نام خانوادگی",
    picture: " ",
  });

  const [securityRecordId, setSecurityRecordId] = useState("");
  const [securityPopup, setSecurityPopup] = useState(false);
  const [securityReport, setSecurityReport] = useState("");

  const [cancelPopup, setCancelPopup] = useState(false);
  const [cancelReport, setCancelReport] = useState("");
  const [showMobileNo, setShowMobileNo] = useState(false);

  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    trackPromise(userInfoSupplier());
    const { clientNo, servantNo } = mobileNos;
    if ((isClient && clientNo) || (!isClient && servantNo)) {
      setShowMobileNo(true);
    }

    connection?.on("ServantMobileNo", (reqWorkingId: string, mobileNo: any) => {
      if (requestWorkingId !== reqWorkingId) return;
      setMobileNos({
        clientNo,
        servantNo: mobileNo,
      });
    });

    connection?.on("ClientMobileNo", (reqWorkingId: string, mobileNo: any) => {
      if (requestWorkingId !== reqWorkingId) return;
      setMobileNos({
        clientNo: mobileNo,
        servantNo,
      });
    });

    connection.on(
      "RefuseRequestWorkingByUser",
      (reqWorkingId: string, userName) => {
        if (requestWorkingId !== reqWorkingId) return;
        if (window.location.pathname.includes("/requestworking/")) {
          history.push("/");
        }
        toast.info(msg6(userName));
      }
    );

    connection!.on(
      "WorkingTime",
      (duration: string, reqWorkingId: string, userName: string) => {
        if (requestWorkingId !== reqWorkingId) return;
        onConfirmSetter(
          msg1(duration, userName),
          () => trackPromise(updateReqWorking(duration)),
          durationRejected
        );
        setConfirmPopupOpen(true);
      }
    );

    connection.on(
      "WorkingTimeRefused",
      (reqWorkingId: string, userName: string) => {
        if (requestWorkingId !== reqWorkingId) return;
        toast.info(msg4(userName));
      }
    );

    connection.on("ConfirmRequestUser", (reqWorkingId: string, IsConfirm) => {
      if (requestWorkingId !== reqWorkingId) return;
      setIsStarted(true);
    });

    connection.on("EndWork", (reqWorkingId: string, userName: string) => {
      if (requestWorkingId !== reqWorkingId) return;
      onConfirmSetter(
        msg3(userName),
        onEndWorkConfirmByClient,
        onEndWorkRejectedByClient
      );
      setConfirmPopupOpen(true);
    });

    connection.on("EndWorkConfirm", (reqWorkingId: string) => {
      if (requestWorkingId !== reqWorkingId) return;
      setConfirmPopupOpen(false);
      history.replace("/");
      connection!.stop().catch(console.log);
      history.push(`/survey/${reqConfirmId}`);
    });

    connection.on(
      "ConfirmRefused",
      (reqWorkingId: string, userName: string) => {
        if (requestWorkingId !== reqWorkingId) return;
        toast.info(msg5(userName));
      }
    );
  }, []);

  useEffect(() => {
    trackPromise(hasStarted());
  }, [isClient]);

  const hasStarted = async () => {
    const res = await service.hasStartWorkingDate(requestWorkingId);
    setIsStarted(res.Data);
  };

  const mobileNoDisplayHandler = () => {
    if (!showMobileNo) {
      onConfirmSetter(msg7, () => displayNoForOther(true));
      setConfirmPopupOpen(true);
    } else {
      onConfirmSetter(msg8, () => displayNoForOther(false));
      setConfirmPopupOpen(true);
    }
  };

  const displayNoForOther = (isPermitted: boolean) => {
    if (isClient) {
      connection
        ?.invoke(
          "ShowMobileNoForServant",
          servantUserId,
          requestWorkingId,
          isPermitted
        )
        .catch((e: any) => {
          //console.log(e);
        });
    } else {
      connection
        ?.invoke(
          "ShowMobileNoForRequestUser",
          requestUserId,
          requestWorkingId,
          isPermitted
        )
        .catch((e: any) => {
          //console.log(e);
        });
    }
    setShowMobileNo(isPermitted);
  };

  const userInfoSupplier = async () => {
    const data: IResult = await service.getAudienceUserInfo(audienceId);
    setUserInfo({
      firstName: data.Data.firstName,
      lastName: data.Data.lastName,
      picture: data.Data.picture,
    });
  };

  const updateReqWorking = async (duration: string) => {
    const data = {
      requestWorkingId,
      duration: toEnglishNumber(duration),
    };
    await service.updateRequestWorking(data);
    connection
      ?.invoke("IsConfirm", true, requestWorkingId, servantUserId)
      .catch((e: any) => {
        //console.log(e);
      });
  };

  const durationRejected = () => {
    const hubNotification = {
      userId: servantUserId,
      SenderUserId: userLogin?.Id,
      SenderUserName: userLogin.FirstName + " " + userLogin.LastName,
    };
    connection!
      .invoke("WorkingTimeRefused", requestWorkingId, hubNotification)
      .catch((e: any) => {
        //console.log(e);
      });
  };

  const insertSecurityIssues = async () => {
    const data = { userId: userLogin.Id, requestWorkingId };
    const res = await service.insertReqWorkingSecurity(data);
    setSecurityRecordId(res.Data);
    setSecurityPopup(true);
  };

  const securityReportHandler = async () => {
    if (!securityReport) {
      toast.error("توضیحات مشکل نمی تواند خالی باشد.");
      return;
    }

    if (!securityRecordId) {
      toast.warning("توضیحات ثبت نشد!");
      return;
    }

    const data = {
      id: securityRecordId,
      reason: securityReport,
    };
    await service.updateReqWorkingSecurity(data);
    setSecurityPopup(false);
    setSecurityReport("");
  };

  const endWork = () => {
    const hubNotification = {
      userId: requestUserId,
      SenderUserId: userLogin?.Id,
      SenderUserName: userLogin.FirstName + " " + userLogin.LastName,
    };
    connection
      .invoke("EndWork", requestWorkingId, hubNotification)
      .catch((e: any) => {
        //console.log(e);
      });
  };

  const onEndWorkConfirmByClient = async () => {
    const data: IConfirmReqWorking = {
      requestWorkingId,
      requestRegistrationId,
      requestUserId,
      servantUserId,
    };
    connection.invoke("EndWorkConfirm", data).catch((e: any) => {
      //console.log(e);
    });
  };

  const onEndWorkRejectedByClient = () => {
    const hubNotification = {
      userId: servantUserId,
      SenderUserId: userLogin?.Id,
      SenderUserName: userLogin.FirstName + " " + userLogin.LastName,
    };
    connection
      .invoke("ConfirmRefused", requestWorkingId, hubNotification)
      .catch((e: any) => {
        //console.log(e);
      });
  };

  const cancelConfirmationTaker = () => {
    if (!cancelReport) {
      toast.error("توضیحات لغو نمی تواند خالی باشد.");
      return;
    }

    onConfirmSetter(cancelMsgToMe, cancelReportHandler, () =>
      setCancelPopup(false)
    );
    setConfirmPopupOpen(true);
  };

  const cancelReportHandler = async () => {
    const data = {
      requestWorkingId,
      requestRegistrationId,
      requestUserId,
      servantUserId,
      canceledDescription: cancelReport,
    };

    if (isClient) {
      connection
        .invoke(
          "RefuseRequestWorkingByRequestUser",
          data,
          userLogin.FirstName + " " + userLogin.LastName
        )
        .catch((e: any) => {
          //console.log(e);
        });
    } else {
      connection
        .invoke(
          "RefuseRequestWorkingByServantUser",
          data,
          userLogin.FirstName + " " + userLogin.LastName
        )
        .catch((e: any) => {
          //console.log(e);
        });
    }
    history.push("/");
    setCancelPopup(false);
    setCancelReport("");
  };

  //TODO: One of the standards btn sizes.
  const smallBtnSize = matchesSm ? "sm" : "lg";

  return (
    <Paper className="working-issue-actions-paper chat-complementary-paper">
      <Popup
        open={securityPopup}
        onCloseHandler={() => setSecurityPopup(false)}
        className="working-popup"
      >
        <div className="working-upper-textfield-wrapper">
          <TextField
            label="توضیحات مشکل"
            value={securityReport}
            onTextChange={setSecurityReport}
            multiline
            helperText={securityReportHint}
          />
        </div>
        <div className="working-popup-btns-wrapper">
          <Button
            label="تایید"
            onClick={() => {
              trackPromise(securityReportHandler());
            }}
            size={matchesSm ? "xs" : "sm"}
          />
          <Button
            label="بازگشت"
            onClick={() => setSecurityPopup(false)}
            className="working-popup-back-btn"
            variant="outlined"
            color="blue"
            size={matchesSm ? "xs" : "sm"}
          />
        </div>
      </Popup>
      <Popup
        open={cancelPopup}
        onCloseHandler={() => setCancelPopup(false)}
        className="working-popup"
      >
        <div className="working-upper-textfield-wrapper">
          <TextField
            label="توضیحات لغو کار"
            value={toPersianNumber(cancelReport)}
            onTextChange={setCancelReport}
            multiline
          />
        </div>
        <div className="working-popup-btns-wrapper">
          <Button
            label="لغو کردن"
            onClick={cancelConfirmationTaker}
            color="red"
            size={matchesSm ? "xs" : "sm"}
          />
          <Button
            label="بازگشت"
            onClick={() => setCancelPopup(false)}
            className="working-popup-back-btn"
            variant="outlined"
            color="blue"
            size={matchesSm ? "xs" : "sm"}
          />
        </div>
      </Popup>
      {matchesSm ? null : (
        <AvatarName
          userName={`${userInfo.firstName} ${userInfo.lastName}`}
          src={userInfo?.picture}
          {...{ isClient, mobileNos }}
          onClick={() => setShowAudienceInfo(true)}
        />
      )}
      <div className="working-switch-wrapper">
        <Switch
          checked={showMobileNo}
          onChange={mobileNoDisplayHandler}
          color="primary"
          // size={matchesSm ? "small" : "medium"}
        />
        <label>نمایش شماره من</label>
      </div>
      <div className="working-btns-wrapper">
        <div className="working-security-btn-wrapper">
          <Button
            label="اعلام مشکل امنیتی"
            onClick={() => {
              trackPromise(insertSecurityIssues());
            }}
            size={smallBtnSize}
            variant="outlined"
            color="orange"
          />
        </div>
        <div className={`${!isClient && "working-lower-btns-wrapper"}`}>
          {!isClient && (
            <>
              {isStarted ? (
                <Button
                  label="تایید انجام"
                  onClick={endWork}
                  size={smallBtnSize}
                />
              ) : (
                <Button
                  label="شروع کار"
                  onClick={() => setDurationPopup(true)}
                  size={smallBtnSize}
                  variant="outlined"
                  color="green"
                />
              )}
            </>
          )}
          <Button
            label="لغو انجام"
            variant="outlined"
            onClick={() => setCancelPopup(true)}
            size={smallBtnSize}
            color="red"
            className={`${!isClient && "working-margined-btn"}`}
          />
        </div>
      </div>
    </Paper>
  );
}

export default IssueAndActions;
