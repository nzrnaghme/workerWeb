import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import DetailsWaitingPopup from "../Registers/WaitingToArrived/Components/WaitingDetailsPopup/index";
import "./index.scss";
import {
  getConfirm,
  updateReqScore,
  getSummaryUserProfileInfo,
  getReqRegistrationInfo,
} from "./IService";
import { OperatorType, SurveyType } from "../Models/Enums";
import { IReqScore, IMatch, IReqInfo } from "./Entities";
import Paper from "../Components/Paper";
import Param from "./presentationals/Param";
import TextField from "../Components/TextField";
import Button from "../Components/Button";
import { toast } from "react-toastify";
import { showLocalStorage } from "../Routers/localStorage";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ButtonBase from "@material-ui/core/ButtonBase";
import { RawAvatar } from "../Components/Avatar";
import { IResult } from "../Services/Entities";
import PersonalCard from "../PersonalCard/index";
import detailIconPopup from "../Images/addRequest/detailsIcon.svg";
import { trackPromise } from "react-promise-tracker";

const surveyHint =
  "*لطفا میزان رضایت خود را در هر کدام از قسمت های زیر اعلام کنید.";
const successMsg = "نظرسنجی با موفقیت ثبت شد.";
const failureMsg = "عملیات با خطا مواجه شد.";

const nullSurveyWarning =
  "برای ثبت نظر خود باید حداقل یکی از موارد فرم نظرسنجی را پر نمایید";

function Survey() {
  const matchesSm = useMediaQuery("(max-width:40rem)");
  const history = useHistory();
  const storageUser = showLocalStorage("user");
  const { reqConfirmId } = useParams<IMatch>();
  const [reqInfo, setReqInfo] = useState<IReqInfo | undefined>();
  const [isClient, setIsClient] = useState<boolean | undefined>();
  const [quality, setQuality] = useState<SurveyType | null>(null);
  const [cost, setCost] = useState<SurveyType | null>(null);
  const [behavior, setBehavior] = useState<SurveyType | null>(null);
  const [description, setDescription] = useState("");
  const [audienceId, setAudienceId] = useState("");

  //details
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [reqRegistrationInfo, setReqRegistrationInfo] = useState({
    title: "",
    content: "",
  });

  //avatar and name
  interface UserInfoSummary {
    id: string;
    firstName: string;
    lastName: string;
    picture: string;
  }
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfoSummary | undefined>();

  useEffect(() => {
    trackPromise(getReqInfoByConfirmId(reqConfirmId));
  }, []);

  useEffect(() => {
    if (!reqInfo || !storageUser) return;
    setIsClient(storageUser.Id === reqInfo.requestUserId);
  }, [reqInfo]);

  useEffect(() => {
    if (isClient == undefined) return;
    setAudienceId(isClient ? reqInfo!.servantUserId : reqInfo!.requestUserId);
    trackPromise(GetProfileSummaryInfo());
  }, [isClient]);

  const getReqInfoByConfirmId = async (reqConfirmId: string) => {
    const data = await getConfirm(reqConfirmId);
    setReqInfo(data.Data);
  };

  const updateRequestScore = async () => {
    if (
      isClient &&
      quality === null &&
      cost === null &&
      behavior === null &&
      description === ""
    ) {
      toast.error(nullSurveyWarning);
      return;
    }
    if (!isClient && behavior === null && description === "") {
      toast.error(nullSurveyWarning);
      return;
    }

    if (!reqInfo) {
      //console.log("Request Info is not supplied by reqConfirmId yet!");
      return;
    }

    const { requestRegistrationId, requestUserId, servantUserId } = reqInfo;
    const data: IReqScore = {
      userId: isClient ? servantUserId : requestUserId,
      requestRegistrationId,
      behavior,
      quality,
      cost,
      description: description === "" ? null : description,
      requestConfirmId: reqConfirmId,
    };

    const res = await updateReqScore(data);
    if (res.Error) {
      toast.error(failureMsg);
      return;
    }

    toast.success(successMsg);
    setDescription("");
    history.replace("/");
    history.push("/");
  };

  const GetProfileSummaryInfo = async () => {
    let userId = isClient ? reqInfo?.servantUserId : reqInfo?.requestUserId;
    const data: IResult = await getSummaryUserProfileInfo(userId!);
    setUserInfo(data.Data);
  };

  const detailsClicked = async () => {
    setDetailOpen(true);
    const res = await getReqRegistrationInfo(reqInfo?.requestRegistrationId!);
    const { title, content } = res.Data;
    setReqRegistrationInfo({ title, content });
  };

  return (
    <>
      <header className="survey-header">
        <div className="survey-avatar-name-wrapper">
          <ButtonBase
            onClick={() => {
              setShowInfoPopup(true);
            }}
            className="avatar-btn"
          >
            <RawAvatar src={userInfo?.picture ?? " "} size="sm" personalCard />
          </ButtonBase>
          <p
            onClick={() => {
              setShowInfoPopup(true);
            }}
            className="text-active"
          >
            {`${userInfo?.firstName ?? ""} ${userInfo?.lastName ?? ""}`}
          </p>
        </div>
        <div className="header-popup-btn">
          <img
            src={detailIconPopup}
            onClick={() => {
              trackPromise(detailsClicked());
            }}
            alt=""
          />
        </div>
      </header>
      <Paper className="survey-paper">
        {/* personalCard */}
        {audienceId && (
          <PersonalCard
            userId={audienceId}
            operatorType={isClient ? OperatorType.Servant : OperatorType.Client}
            open={showInfoPopup}
            onClose={() => setShowInfoPopup(false)}
          />
        )}

        {/* details */}
        <DetailsWaitingPopup
          open={detailOpen}
          title={reqRegistrationInfo.title}
          content={reqRegistrationInfo.content}
          onClose={() => setDetailOpen(false)}
        />
        <div className="survey-paper-data">
          {/* {isClient === undefined && (
            //Refactor needed: All loading should become uniformed.
            <div
              style={{
                position: "fixed",
                display: "contents",
              }}
            >
              <p style={{ padding: "20% 20% 0% 20%", fontSize: "20px" }}>
                درحال بارگذاری
              </p>
              <Box sx={{ width: "100%" }}>
                <LinearProgress />
              </Box>
            </div>
          )} */}
          <p className="survey-hint">{surveyHint}</p>
          {isClient !== undefined && (
            <div
              className={`survey-params-wrapper ${
                isClient && "survey-params-wrapper-isclient"
              }`}
            >
              <Param
                title="اخلاق"
                state={behavior}
                onLiked={() => setBehavior(SurveyType.Like)}
                onDisliked={() => setBehavior(SurveyType.DisLike)}
              />
              {isClient && (
                <>
                  <Param
                    title="کیفیت"
                    state={quality}
                    onLiked={() => setQuality(SurveyType.Like)}
                    onDisliked={() => setQuality(SurveyType.DisLike)}
                  />
                  <Param
                    title="هزینه"
                    state={cost}
                    onLiked={() => setCost(SurveyType.Like)}
                    onDisliked={() => setCost(SurveyType.DisLike)}
                  />
                </>
              )}
            </div>
          )}
          <TextField
            label="توضیحات"
            multiline
            value={description}
            onTextChange={setDescription}
            maxLength={100}
          />
        </div>
        <div className="survey-btns-wrapper">
          <Button
            label="ثبت نظر"
            onClick={() => {
              trackPromise(updateRequestScore());
            }}
            size={matchesSm ? "sm" : "lg"}
            className="survey-register-btn"
          />
          <Button
            label="انصراف"
            onClick={() => {
              history.replace("/");
              history.push("/");
            }}
            size={matchesSm ? "sm" : "lg"}
            variant="outlined"
            color="red"
          />
        </div>
      </Paper>
    </>
  );
}

export default Survey;
