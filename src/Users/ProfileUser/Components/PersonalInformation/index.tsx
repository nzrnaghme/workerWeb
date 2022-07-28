import "./index.scss";
import { useState } from "react";
import Paper from "../../../../Components/Paper";
import { IUserInfo, IuserInfor } from "../../Entities";
import { TextField } from "@material-ui/core";
import { Gender } from "../../../../Models/Enums";
import {
  toEnglishNumber,
  toPersianNumber,
} from "../../../../Components/hooks/persianHelper";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import * as Yup from "yup";
import { Formik, ErrorMessage, Field, Form } from "formik";
import {
  validateName,
  validateNationalCode,
} from "../../../../Components/hooks/Validations";
import { genderOptions } from "../../../RegisterUser/Entities";
import Button from "../../../../Components/Button";
import SelectField from "../../../../Components/Inputs/SelectField";
import { DateFormik } from "../../../../Components/DateTimePicker/DatePickerPersian";
import moment from "moment";
import { toast } from "react-toastify";

type Props = {
  personInformationData: IUserInfo;
  callBackToUserInfo: (userInfo: IuserInfor) => void;
};

function PersonalInformation({
  personInformationData,
  callBackToUserInfo,
}: Props) {
  const matchesSm = useMediaQuery("(max-width:40rem)");
  const [gender, setGender] = useState<Gender>(personInformationData.gender);

  const initialValues = {
    firstName: personInformationData.firstName,
    lastName: personInformationData.lastName,
    nationalCode: personInformationData?.nationalCode ?? "",
    date: personInformationData?.birthDay ?? "",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .max(20, "تعداد حروف بیش از حد مجاز است")
      .required("نام الزامی است"),
    lastName: Yup.string()
      .max(20, "تعداد حروف بیش از حد مجاز است")
      .required(" نام خانوادگی الزامی است"),
    date: Yup.date().required("تاریخ تولد را هم وارد کنید"),
    nationalCode: Yup.string().required("کد ملی الزامی است"),
  });

  const onSubmit = (values: any) => {
    let NowFormat = moment(new Date()).format("YYYY-MM-DD");
    let BirthDate = moment(values.date).format("YYYY-MM-DD");
    if (BirthDate === NowFormat) {
      toast.error("تاریخ نباید امروز باشد.");
      return;
    }
    const user: IuserInfor = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      nationalCode: toEnglishNumber(values.nationalCode),
      birthDay: toEnglishNumber(BirthDate),
      gender: gender,
    };
    callBackToUserInfo(user);
  };

  return (
    <Paper className="profile-paper">
      <p className="profile-paper-title">اطلاعات شخصی</p>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(props) => (
          <Form noValidate className="user-registry-form">
            <div className="personal-info-items-wrapper">
              <div className="personal-info-item1">
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
                  label="نام"
                  helperText={<ErrorMessage name="firstName" />}
                  validate={validateName}
                />
              </div>
              <div className="personal-info-item2">
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
                  label="نام خانوادگی"
                  helperText={<ErrorMessage name="lastName" />}
                />
              </div>
              <div className="personal-info-item3">
                <Field
                  as={SelectField}
                  size="small"
                  label="جنسیت"
                  value={gender}
                  onSelectChanged={setGender}
                  options={genderOptions}
                />
              </div>
              <div className="personal-info-item4">
                <TextField
                  fullWidth
                  label="شماره همراه"
                  disabled
                  variant="standard"
                  size="small"
                  inputProps={{ dir: "ltr" }}
                  value={toPersianNumber(personInformationData!.mobileNo)}
                />
              </div>
              <div className="personal-info-item5">
                <DateFormik
                  label="تاریخ تولد"
                  name="date"
                  maxDate={new Date()}
                />
              </div>
              <div className="personal-info-item6">
                <Field
                  name="nationalCode"
                  validate={validateNationalCode}
                  as={TextField}
                  fullWidth
                  value={toPersianNumber(props.values.nationalCode)}
                  onChange={(c: any) => {
                    let EnglishNatioanlCode = toEnglishNumber(c.target.value);
                    if (c.target.value === "") {
                      props.handleChange(c);
                    } else if (!/^[0-9]+$/i.test(EnglishNatioanlCode)) {
                      props.handleChange("");
                    } else {
                      props.handleChange(c);
                    }
                  }}
                  variant="standard"
                  size="small"
                  error={
                    props.errors.nationalCode && props.touched.nationalCode
                  }
                  inputProps={{ maxLength: 10, dir: "ltr" }}
                  label="کد ملی"
                  helperText={<ErrorMessage name="nationalCode" />}
                />
              </div>
            </div>
            <div className="profile-paper-btn-wrapper">
              <Button label="ذخیره" submit size={matchesSm ? "sm" : "lg"} />
            </div>
          </Form>
        )}
      </Formik>
    </Paper>
  );
}

export default PersonalInformation;
