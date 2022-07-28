import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import Paper from "../../../../Components/Paper";
import { disablityOptions } from "../../Entities";
import TextFieldM from "../../../../Components/TextField";
import Button from "../../../../Components/Button";
import MultiAutoComplete from "../../../../Components/Inputs/MultiAutoComplete";
import LocationWithoutMap, {
  GridClassNames,
} from "../../../../Components/Location/RegionControl";
import { IdropDownModel } from "../../../../Components/Inputs/DropDown";
import { IUserInfo } from "../../Entities";
import { IRegion } from "../../../../Components/Maps/Entities";
import { validateEmail } from "../../../../Components/hooks/Validations";
import "./index.scss";
import AddressInformation from "../AddressInformation";

const gridClassNames: GridClassNames = {
  wrapper: "more-info-location-fields-grid-wrapper",
  item1: "more-info-location-fields-grid-item1",
  item2: "more-info-location-fields-grid-item2",
  item3: "more-info-location-fields-grid-item3",
};

type Props = {
  personalData: IUserInfo | undefined;
  UpdateMore: (
    region: string[] | null,
    disability: number[],
    email: string,
    bio: string
  ) => void;
};

function Moreinformation({ personalData, UpdateMore }: Props) {
  const matchesSm = useMediaQuery("(max-width:40rem)");
  const [bio, setBio] = useState<string>("");
  const [area, setArea] = useState<IRegion | null>(null);
  const [emailInfo, setEmailInfo] = useState<string>("");
  const [showDetails, setShowDetails] = useState(false);
  const [tempRegion, setTempRegion] = useState<string[] | null>(["", "", ""]);
  const [disability, setDisability] = useState<IdropDownModel[] | undefined>([
    { id: "", name: "" },
  ]);

  useEffect(() => {
    const className = "more-info-email-disability-wrapper";
    const inputOfDisability = document.querySelector(
      `.${className} #disability`
    )! as HTMLInputElement;

    inputOfDisability.parentElement!.style.height = "40px";

    inputOfDisability!.disabled = true;

    if (disability!.length === 2) {
      inputOfDisability.style.display = "none";
    } else {
      inputOfDisability.style.display = "block";
    }
  }, [disability]);

  useEffect(() => {
    if (personalData != null) {
      if (personalData.bio === null) {
        setBio("");
      } else {
        setBio(personalData.bio);
      }
      if (personalData.emailAddress === null) {
        setEmailInfo("");
      } else {
        setEmailInfo(personalData.emailAddress);
      }
      if (personalData.region != null) {
        if (
          personalData.region[0] != null &&
          personalData.region[1] != null &&
          personalData.region[2] != null
        ) {
          setArea({
            state: personalData.region[0] ?? "",
            city: personalData.region[1] ?? "",
            region: personalData.region[2] ?? "",
          });
        } else if (
          personalData.region[0] != null &&
          personalData.region[1] === null &&
          personalData.region[2] === null
        ) {
          setArea({
            state: personalData.region[0] ?? "",
            city: null ?? "",
            region: null ?? "",
          });
        } else if (
          personalData.region[0] != null &&
          personalData.region[1] != null &&
          personalData.region[2] === null
        ) {
          setArea({
            state: personalData.region[0] ?? "",
            city: personalData.region[1] ?? "",
            region: null ?? "",
          });
        }
      } else {
        setArea({
          state: null ?? "",
          city: null ?? "",
          region: null ?? "",
        });
      }
      if (personalData.disability != null) {
        const disablityValues = personalData.disability.map((i) => {
          return disablityOptions.find((option) => option.id === i);
        });
        setDisability(disablityValues as IdropDownModel[]);
      }
      if (personalData.disability === null) {
        setDisability([]);
        return;
      }
    }
  }, [personalData]);

  const initialValues = {
    emailFiled: personalData?.emailAddress ? personalData.emailAddress : "",
  };

  const validationSchema = yup.object().shape({
    emailFiled: yup
      .string()
      .email("لطفا آدرس ایمیل خود را به درستی وارد نمائید."),
  });

  const onRegionChanged = (
    stateId: string,
    cityId: string,
    regionId: string
  ) => {
    if (stateId == "") {
      setTempRegion(null);
      return;
    }
    setTempRegion([stateId, cityId, regionId]);
  };

  const disabilityHandler = (_: any, val: any) => {
    setDisability(val);
  };

  const onSubmit = (values?: any) => {
    const disabilityIdsArr =
      disability != null && disability?.length > 0
        ? disability.map((i) => parseInt(i.id))
        : [];
    UpdateMore(tempRegion, disabilityIdsArr, values.emailFiled, bio);
  };

  return (
    <Paper className="profile-paper">
      <p className="profile-paper-title">سایر اطلاعات</p>
      {personalData && (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form noValidate>
            <LocationWithoutMap
              area={area}
              onRegionChanged={onRegionChanged}
              cssRefactor
              gridClassNames={gridClassNames}
            />
            <div className="more-info-email-disability-wrapper">
              <div>
                <Field
                  component={TextFieldM}
                  name="emailFiled"
                  label="ایمیل"
                  helperText={<ErrorMessage name="emailFiled" />}
                  dir="ltr"
                  validate={validateEmail}
                />
              </div>
              <div>
                <MultiAutoComplete
                  label="وضعیت جسمانی"
                  value={disability}
                  setValue={disabilityHandler}
                  options={disablityOptions}
                  freeSolo={disability?.length === 2}
                  id="disability"
                />
              </div>
            </div>
            <TextFieldM
              label="درباره من"
              multiline
              maxLength={100}
              // rows={3}
              value={bio}
              onTextChange={setBio}
            />
            <div
              className="address-more"
              onClick={() => {
                if (showDetails) {
                  setShowDetails(false);
                } else setShowDetails(true);
              }}
            >
              <label>آدرس دیگر</label>
            </div>
            <AddressInformation
              open={showDetails}
              onClose={() => setShowDetails(false)}
            />
            <div className="profile-paper-btn-wrapper">
              <Button
                label="ذخیره"
                submit
                size={matchesSm ? "sm" : "lg"}
                className="more-info-btn"
              />
            </div>
          </Form>
        </Formik>
      )}
    </Paper>
  );
}
export default Moreinformation;
