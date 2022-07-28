import { useState, useEffect, useRef } from "react";
import ModeSwitcher from "../../../Components/ModeSwitcher";
import { IdropDownModel } from "../../../Components/Inputs/DropDown";
import Select from "../../../Components/Inputs/SingleSearchDropDown";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { ILocation } from "../../../Components/Maps/Entities";
import { useHistory, useParams } from "react-router-dom";
import { IResult } from "../../../Services/Entities";
import { TextField } from "@material-ui/core";
import Button from "../../../Components/Button";
import Paper from "../../../Components/Paper";
import { toast } from "react-toastify";
import * as service from "./Service";
import LocationEditPopup from "./Components/LocationEditPopup";
import DetailsEditPopup from "./Components/DetailEditPopup";
import TimeEditPopup from "./Components/TimeEditPopup";
import locationIcon from "../../../Images/addRequest/locationIcon.svg";
import detailsIcon from "../../../Images/addRequest/detailsIcon.svg";
import timeIcon from "../../../Images/addRequest/timeIcon.svg";
import { Formik, Field, Form } from "formik";
import * as yup from "yup";
import { IRegisterUpdate } from "./Entities";
import {
  FileType,
  PresenceTypeCategory,
  RequestType,
} from "../../../Models/Enums";
import "../index.scss";
import {
  toEnglishNumber,
  toPersianNumber,
} from "../../../Components/hooks/persianHelper";
import { IEditFile } from "../../../Components/FileUploader";
import { showLocalStorage } from "../../../Routers/localStorage";
import { trackPromise } from "react-promise-tracker";

const audioFormats = ["mp3", "wma", "m4a"];
const imageFormats = ["jpeg", "png", "gif", "jpg", "bmp"];
const videoFormats = ["mkv", "mp4", "3gp"];
const docFormats = ["doc", "docx", "xls", "xlsx", "rtf", "txt", "pdf"];

function EditRequest() {
  const storageUser = showLocalStorage("user");
  const matchesSm = useMediaQuery("(max-width:40rem)");
  const buttonRef = useRef<any>();
  const match = useParams<any>();
  const history = useHistory();

  //messages
  const msg2 =
    "درخواست با موفقیت ویرایش شد، تا دقایقی دیگر درخواست شما در لیست درخواستها قایل مشاهده خواهد بود.";
  const msg4 = " عکس پروفایل شما ثبت و یا تایید نشده است.";
  const msg11 = "لطفا استان محل خدمت را وارد کنید.";
  const msg7 = (countOfRequest: number) =>
    `با توجه به اینکه درخواست شما در حال بررسی ${toPersianNumber(
      countOfRequest
    )} نفر است،امکان ویرایش را ندارید.`;

  //popupsOpen
  const [mapOpen, setMapOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [detailesOpen, setdetailesOpen] = useState(false);

  //base
  const [requestRegistrationId, setRequestRegistrationId] = useState("");
  const [presence, setPresence] = useState(PresenceTypeCategory.Presence);
  const [requestType, setRequestType] = useState<RequestType>(
    RequestType.Emergency
  );
  const [categories, setCategories] = useState<IdropDownModel[]>([
    {
      id: "",
      name: "",
    },
  ]);
  const [category, setCategory] = useState<IdropDownModel>({
    id: "",
    name: "",
  });
  const [title, setTitle] = useState("");

  //location
  const [stateId, setStateId] = useState<string | null>("");
  const [cityId, setCityId] = useState<string | null>("");
  const [regionId, setRegionId] = useState<string | null>("");
  const [location, setLocation] = useState<ILocation | undefined | null>();
  const [regionsName, setRegionsName] = useState<string[] | null>([]);

  //time
  const [date, setDate] = useState<Date | null | undefined>();
  const [time, setTime] = useState<string | null | undefined>();

  //details
  const [fileList, setFileList] = useState<IEditFile[]>([]);
  const [fileCount, setFileCount] = useState(0);
  const [fileSize, setFileSize] = useState(0);
  const [details, setDetails] = useState("");
  const [hour, setHour] = useState(1);

  const [CfgBeginWorkDateDeadline, setCfgBeginWorkDateDeadline] = useState();

  useEffect(() => {
    if (storageUser != null && storageUser.Id != null && storageUser.Id != "") {
      trackPromise(fillCategories());
      trackPromise(config());
    }
  }, []);

  useEffect(() => {
    if (categories.length === 0) return;
    trackPromise(getRequestRegistrationForEdit());
  }, [categories]);

  const initialValues = {
    title: title,
  };
  const validationSchema = yup.object().shape({
    title: yup.string().required("عنوان درخواست خود را وارد کنید"),
  });

  const locationClicked = async () => {
    setMapOpen(true);
  };
  const timeClicked = () => {
    setTimeOpen(true);
  };
  const detailesClicked = () => {
    setdetailesOpen(true);
  };

  //upload file
  const fileLoaded = (fileExtension: string) => {
    let fileType: FileType = FileType.Doc;
    if (docFormats.includes(fileExtension)) fileType = FileType.Doc;
    else if (imageFormats.includes(fileExtension)) fileType = FileType.Image;
    else if (videoFormats.includes(fileExtension)) fileType = FileType.Video;
    else if (audioFormats.includes(fileExtension)) fileType = FileType.Audio;
    return fileType;
  };

  const handleFileChosen = async (file: IEditFile) => {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.readAsDataURL(file.uploadedFile!);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = reject;
    });
  };

  const readAllFiles = async (AllFiles: IEditFile[]) => {
    const results = await Promise.all(
      AllFiles.map(async (file) => {
        if (file.uploadedFile == undefined) {
          return {
            content: file.file,
            extension: file.name.split(".").pop()!.toLowerCase(),
            fileType: fileLoaded(file.name.split(".").pop()!.toLowerCase()),
            fileSize: file.fileSize,
          };
        }
        const fileContents = await handleFileChosen(file);
        return {
          content: fileContents,
          extension: file.name.split(".").pop()!.toLowerCase(),
          fileType: fileLoaded(file.name.split(".").pop()!.toLowerCase()),
          fileSize: file.uploadedFile.size,
        };
      })
    );
    return results;
  };

  //elemental value
  const getRequestRegistrationForEdit = async () => {
    const res = await service.getRequestRegistrationForEdit(match.requestId);

    let data = res.Data;
    setTitle(toPersianNumber(data.title));
    setPresence(data.presenceType);
    setRequestType(data.requestType);
    setHour(data.expiration);
    setDetails(data.content);
    let newtAllFilesObj: IEditFile[] = [];
    var max = 1;
    data.attachments.map((c: any) => {
      newtAllFilesObj.push({
        name: max + "." + c.fileExtension,
        id: c.id,
        file: c.content,
        numberName: max++,
        fileSize: c.fileSize,
      });
    });
    setLocation(res.Data.location);
    setFileList(newtAllFilesObj);
    if (data.beginDate === null) {
      setDate(null);
    } else {
      setDate(new Date(data.beginDate));
    }

    setTime(data.beginTime);
    if (data.region !== null) {
      if (data.region[0] !== null) {
        setStateId(data.region[0]);
        if (data.region[1] !== null) {
          setCityId(data.region[1]);
          if (data.region[2] !== null) {
            setRegionId(data.region[2]);
          }
        }
      }
    }

    if (data.stateName) {
      if (data.cityName) {
        if (data.regionName)
          setRegionsName([data.stateName, data.cityName, data.regionName]);
        else setRegionsName([data.stateName, data.cityName]);
      } else setRegionsName([data.stateName]);
    } else setRegionsName(null);

    setRequestRegistrationId(data.id);

    //category
    const categoryCurrent = categories.find(
      (c) => c.id === data.requestCategoryId
    );
    setCategory(categoryCurrent!);
  };

  //fillCategory
  const fillCategories = async () => {
    let x: IResult = await service.getCategories();
    setCategories(x.Data as IdropDownModel[]);
  };

  //config
  const config = async () => {
    let x: IResult = await service.getConfigs();
    setCfgBeginWorkDateDeadline(x.Data.cfgBeginWorkDateDeadline);
    //uploadFileSize
    setFileSize(x.Data.cfgRequestRegistrationFileVolumeSize);
    setFileCount(x.Data.cfgRequestRegistrationFileCount);
  };

  //profile image
  const checkProfileBeforeSave = async (values: any) => {
    let f: IResult = await service.hasProfileImage(storageUser.Id);
    if (f.Data === false) {
      toast.info(msg4);
    } else {
      checkStateId(values);
    }
  };

  const checkStateId = (values: any) => {
    if (presence === PresenceTypeCategory.Presence) {
      if (stateId === "" || stateId === null) {
        toast.info(msg11);
      } else {
        checkCountAccept(values);
        // continueSubmit(values);
      }
    } else {
      checkCountAccept(values);

      // continueSubmit(values);
    }
  };

  const checkCountAccept = async (values: any) => {
    const count = await service.getCountAcceptRequestConfirm(
      requestRegistrationId
    );
    if (count.Data === 0) continueSubmit(values);
    else toast.warning(msg7(count.Data));
  };

  const regions = (regions: string[]) => {
    if (regions[0] === undefined || regions[0] === "") {
      return null;
    }
    if (regions[1] === undefined || regions[1] === "") {
      return [regions[0], null, null];
    }
    if (regions[2] === undefined || regions[2] === "") {
      return [regions[0], regions[1], null];
    } else {
      return [regions[0], regions[1], regions[2]];
    }
  };

  const continueSubmit = async (values: any) => {
    let temp = await readAllFiles(fileList);
    const updateModel: IRegisterUpdate = {
      requestRegistrationId: requestRegistrationId,
      serviceCategoryId: category == null ? null : category.id,
      presenceType: presence,
      region: regions([stateId!, cityId!, regionId!]),
      location: location ? location : null,
      fileList: temp,
      content: details ? details : null,
      title: toEnglishNumber(values.title),
      beginDate: date ? toEnglishNumber(date.toJSON().split("T")[0]) : null,
      beginTime: time ? toEnglishNumber(time) : null,
      locationName: location?.name ? location?.name : null,
      requestType: requestType,
    };
    if (updateModel.beginDate && requestType !== RequestType.Emergency) {
      if (new Date().toISOString().split("T")[0] === updateModel.beginDate) {
        let h = Number(new Date().getHours());
        let m;
        if (new Date().getMinutes() <= 9) {
          m = "0" + new Date().getMinutes();
        } else {
          m = new Date().getMinutes();
        }
        if (time) {
          if (h === Number(toEnglishNumber(time?.split(":")[0]))) {
            if (
              m > Number(toEnglishNumber(time?.split(":")[1].split(":")[0]))
            ) {
              toast.info("زمان انجام کار معتبر نمی باشد.");
              return;
            } else {
              finalSubmit(updateModel);
              return;
            }
          } else if (h > Number(time?.split(":")[0])) {
            toast.info("زمان انجام کار معتبر نمی باشد.");
            return;
          } else {
            finalSubmit(updateModel);
            return;
          }
        } else {
          finalSubmit(updateModel);
          return;
        }
      } else if (
        new Date().toISOString().split("T")[0] > updateModel.beginDate
      ) {
        toast.info("زمان انجام کار معتبر نمی باشد.");
        return;
      } else {
        finalSubmit(updateModel);
        return;
      }
    } else {
      finalSubmit(updateModel);
      return;
    }
  };

  const finalSubmit = async (updateModel: IRegisterUpdate) => {
    const res: IResult = await service.updateRequestRegistration(updateModel);

    if (res.Status === 200) {
      toast.info(msg2);
    } else {
      toast.error("ویرایش درخواست با مشکل مواجه شد با پشتیبانی تماس بگیرید");
    }
    history.push("/");
  };

  //save
  const onSubmit = async (values: any) => {
    checkProfileBeforeSave(values);
  };

  //reject
  const onReject = () => {
    history.push("/MyRequestList");
  };

  const dateTimeDisplayer = (
    date: Date | undefined | null,
    time: string | undefined
  ) => {
    let faDate;
    let faTime;
    if (date) faDate = toPersianNumber(date?.toLocaleDateString("fa-IR"));
    if (time) faTime = toPersianNumber(time);

    let dateTime = "";
    if (faTime) {
      dateTime = faTime;

      if (faDate) {
        dateTime += ` - ${faDate}`;
      }
    } else if (faDate) {
      dateTime = faDate;
    }
    if (dateTime) return dateTime;

    return "تعیین نشده";
  };

  const regionDisplayer = (region: string[] | undefined[] | null) => {
    if (region) {
      if (region[0]) {
        if (region[1]) {
          if (region[2]) {
            return `${region[0]} - ${region[1]} - ${region[2]}`;
          } else return `${region[0]} - ${region[1]}`;
        } else return `${region[0]}`;
      }
      return "تعیین نشده";
    }
  };

  return (
    <>
      <header className="upsert-header-btns-wrapper">
        <div className="upsert-header-btn">
          <img
            alt=""
            style={{
              opacity: presence === 0 ? 1 : 0.5,
            }}
            src={locationIcon}
            onClick={presence === 0 ? locationClicked : () => {}}
          />
        </div>
        <div className="upsert-header-btn">
          <img alt="" src={detailsIcon} onClick={detailesClicked} />
        </div>
        <div className="upsert-header-btn">
          <img
            alt=""
            style={{
              opacity: requestType === 0 ? 1 : 0.5,
            }}
            src={timeIcon}
            onClick={requestType === 0 ? timeClicked : () => {}}
          />
        </div>
      </header>
      <Paper className="upsert-paper">
        {title !== "" && (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {(props) => (
              <Form noValidate className="upsert-form">
                <div className="upsert-form-data-wrapper">
                  <div className="upsert-fields-grid-container">
                    <div className="upsert-fields-grid-item-1">
                      <Field
                        as={TextField}
                        value={toPersianNumber(props.values.title)}
                        label="عنوان درخواست"
                        name="title"
                        variant="standard"
                        size="small"
                        onChange={(c: any) => {
                          if (c.target.value.length <= 55)
                            props.handleChange(c);
                        }}
                        error={props.errors.title && props.touched.title}
                        fullWidth
                        helperText={
                          props.errors.title
                            ? props.errors.title
                            : "عنوان درخواست خود را بیان کنید"
                        }
                      />
                    </div>
                    <div className="upsert-fields-grid-item-2">
                      <Select
                        label="دسته بندی"
                        value={category}
                        setValue={setCategory}
                        options={categories}
                        helperText="جهت تسریع در پذبرش درخواست لطفا دسته بندی مورد نظر را مشخص نمایید"
                      />
                    </div>
                  </div>
                  <div className="upsert-request-details-wrapper">
                    <div className="upsert-request-details-item">
                      <ModeSwitcher
                        rightLabel="حضوری"
                        leftLabel="غیر حضوری"
                        checked={presence === PresenceTypeCategory.Presence}
                        onChecked={(checked) => {
                          if (checked) {
                            setPresence(PresenceTypeCategory.Presence);
                          } else {
                            setPresence(PresenceTypeCategory.UnPresence);
                          }
                        }}
                      />
                    </div>
                    <div className="upsert-request-details-item">
                      <div>
                        <label>تاریخ و زمان انجام:</label>
                        <span dir="ltr">
                          {requestType === RequestType.Normal
                            ? dateTimeDisplayer(date, time)
                            : "---"}
                        </span>
                      </div>
                      <div>
                        <label>محل انجام:</label>
                        {presence === PresenceTypeCategory.UnPresence
                          ? "---"
                          : regionDisplayer(regionsName)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="upsert-btns-grid-container" ref={buttonRef}>
                  <Button
                    label="ویرایش"
                    submit
                    className="upsert-btn-grid-item-1"
                    size={matchesSm ? "sm" : "lg"}
                  />
                  <Button
                    label="انصراف"
                    onClick={onReject}
                    className="upsert-btn-grid-item-2"
                    size={matchesSm ? "sm" : "lg"}
                    variant="outlined"
                    color="red"
                  />
                </div>
              </Form>
            )}
          </Formik>
        )}
      </Paper>
      <DetailsEditPopup
        requestType={requestType}
        hour={hour}
        details={details}
        fileSize={fileSize}
        fileCount={fileCount}
        editFiles={fileList}
        onConfirm={(s) => {
          setDetails(s.details);
          setdetailesOpen(false);
          setFileList(s.fileList);
        }}
        handleClose={() => {
          setdetailesOpen(false);
        }}
        open={detailesOpen}
        onClose={() => {
          setdetailesOpen(false);
        }}
      />
      <TimeEditPopup
        open={timeOpen}
        onClose={() => {
          setTimeOpen(false);
        }}
        date={date}
        time={time}
        CfgBeginWorkDateDeadline={CfgBeginWorkDateDeadline!}
        onConfirm={(s) => {
          setDate(s.date);
          setTime(s.time);
          setTimeOpen(false);
        }}
        handleClose={() => {
          setTimeOpen(false);
        }}
      />
      <LocationEditPopup
        currentState={stateId!}
        currentCity={cityId!}
        currentRegion={regionId!}
        currentLocation={location ? location : null}
        onConfirm={(s) => {
          if (s.state === "" && s.city === "" && s.region === "") {
            setStateId(null);
            setCityId(null);
            setRegionId(null);
          } else if (s.state != "" && s.city === "" && s.region === "") {
            setStateId(s.state);
            setCityId(null);
            setRegionId(null);
          } else if (s.state != "" && s.city != "" && s.region === "") {
            setStateId(s.state);
            setCityId(s.city);
            setRegionId(null);
          } else {
            setStateId(s.state);
            setCityId(s.city);
            setRegionId(s.region);
          }
          setLocation(s.location);
          setMapOpen(false);
          setRegionsName(s.regionNames);
        }}
        open={mapOpen}
        onClose={() => {
          setMapOpen(false);
        }}
      />
    </>
  );
}

export default EditRequest;
