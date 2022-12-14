import { useState, useRef, useEffect } from "react";
import "./index.scss";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import * as Yup from "yup";
import { Formik, ErrorMessage, Field, Form } from "formik";
import Paper from "../../Components/Paper";
import { TextField } from "@material-ui/core";
import Button from "../../Components/Button";
import SelectField from "../../Components/Inputs/SelectField";
import { EditableAvatar } from "../../Components/Avatar";
import { useHistory } from "react-router-dom";
import * as service from "./IService";
import { Iuser } from "./Entities";
import { Gender } from "../../Models/Enums";
import { genderOptions, msg } from "./Entities";
import { toast } from "react-toastify";
import { IResult } from "../../Services/Entities";
import { addLocalStorage, showLocalStorage } from "../../Routers/localStorage";
import imagePicker from "../../Components/FileUploader/imagePicker";
import { validateName } from "../../Components/hooks/Validations";
import { trackPromise } from "react-promise-tracker";

function UserRegistry() {
  const matchesSm = useMediaQuery("(max-width:40rem)");
  const storageUser = showLocalStorage("user");
  const [gender, setGender] = useState<Gender>(Gender.Male);
  const [imgVolumeLimit, setImgVolumeLimit] = useState(400);
  const [img, setImg] = useState<string | null>(null);
  const upsertImgRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<any>();

  const history = useHistory();

  //PicVolumeSizeLimitation
  useEffect(() => {
    const volumeThreshold = async () => {
      const res: IResult = await service.getImgVolumeLimit();
      if (res.Error != null) return;
      const volume = res.Data.cfgUserRegistrationPicVolumeSize;
      setImgVolumeLimit(volume * 1024);
    };
    volumeThreshold();
  }, []);

  const okHandler = () => {
    upsertImgRef.current!.click();
  };

  const onUploadingImg = async (e: any) => {
    const file = e.target.files[0];
    if (
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/jpg"
    ) {
      let blob: Blob | undefined = await imagePicker(file);
      if (blob === undefined) return;

      if (blob.size > imgVolumeLimit) {
        toast.error("?????? ?????? ?????? ???? ???? ???????? ??????.");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        setImg(reader.result as string);
      };
    } else {
      toast.error("???????? ???????? ???????? ????????.");
      return;
    }
  };

  const onUpsertImgClicked = () => {
    if (img === null || img.trim().length === 0) {
      toast.info(msg);
      okHandler();
    } else {
      upsertImgRef.current!.click();
    }
  };

  const onSubmit = async (values?: any) => {
    if (storageUser != null && storageUser.MobileNo != "") {
      buttonRef.current = true;
      const user: Iuser = {
        firstName: values.firstName.trim(),
        mobileNo: storageUser?.MobileNo,
        lastName: values.lastName.trim(),
        gender: gender,
        picture: img,
      };
      const res: IResult = await service.insertUser(user);
      if (res.Error != null) {
        toast.error("?????? ???????? ?????? ?????? ???????? ??????.");
        history.push("/Login");
        return;
      }

      storageUser.Id = res.Data.userId;
      storageUser.FirstName = user.firstName;
      storageUser.LastName = user.lastName;
      storageUser.MobileNo = storageUser?.MobileNo;
      storageUser.AccessToken = res.Data.token.accessToken;
      storageUser.RefreshToken = res.Data.token.refreshToken;

      addLocalStorage(JSON.stringify(storageUser), "user");
      toast.success("?????? ?????? ?????????? ????.");
      window.location.reload();
    }
  };

  const initialValues = {
    firstName: "",
    lastName: "",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .max(255, "?????????? ???? ???? ????????")
      .required("?????? ???????????? ??????"),
    lastName: Yup.string()
      .max(255, "?????????? ???? ???? ????????")
      .required(" ?????? ???????????????? ???????????? ??????"),
  });

  return (
    <Paper className="user-registry-paper">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(props) => (
          <Form noValidate className="user-registry-form">
            <div className="user-registry-form-grid-avatar">
              <EditableAvatar
                src={img}
                onUploadingImg={onUploadingImg}
                onUpsertClicked={onUpsertImgClicked}
                upsertRef={upsertImgRef}
                onDeleteClicked={() => {
                  setImg(null);
                  upsertImgRef.current!.value = "";
                }}
                verifiedPictureUser={true}
              />
              <div className="register-grid-container">
                <div className="register-grid-item-1">
                  <Field
                    as={TextField}
                    fullWidth
                    value={props.values.firstName}
                    onChange={(c: any) => {
                      let Firstname = c.target.value;
                      if (Firstname.includes(".")) {
                        props.handleChange("");
                      } else {
                        c.target.value = c.target.value.replace(/\s+/g, " ");
                        props.handleChange(c);
                      }
                    }}
                    variant="standard"
                    size="small"
                    name="firstName"
                    error={props.errors.firstName && props.touched.firstName}
                    label="??????"
                    helperText={<ErrorMessage name="firstName" />}
                    validate={validateName}
                  />
                </div>
                <div className="register-grid-item-2">
                  <Field
                    as={TextField}
                    fullWidth
                    onChange={(c: any) => {
                      let lastName = c.target.value;
                      if (lastName.includes(".")) {
                        props.handleChange("");
                      } else {
                        c.target.value = c.target.value.replace(/\s+/g, " ");
                        props.handleChange(c);
                      }
                    }}
                    value={props.values.lastName}
                    variant="standard"
                    size="small"
                    name="lastName"
                    validate={validateName}
                    error={props.errors.lastName && props.touched.lastName}
                    label="?????? ????????????????"
                    helperText={<ErrorMessage name="lastName" />}
                  />
                </div>
                <div className="register-grid-item-3">
                  <Field
                    as={SelectField}
                    size="small"
                    label="??????????"
                    value={gender}
                    onSelectChanged={setGender}
                    options={genderOptions}
                  />
                </div>
              </div>
            </div>
            <div className="user-registry-btn">
              <Button
                label="?????? ??????????????"
                size={matchesSm ? "sm" : "lg"}
                disabled={buttonRef.current}
                submit
              />
            </div>
          </Form>
        )}
      </Formik>
    </Paper>
  );
}
export default UserRegistry;
