import { useState } from "react";
import { useMediaQuery } from "@material-ui/core";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import OurButton from "../../../../../Components/Button";
import MapContainer from "../../../../../Components/Maps/MapContainer";
import RegionControl from "../../../../../Components/Location/RegionControl";
import NumberText from "../../../../../Components/Inputs/NationalCode";
import TextField from "../../../../../Components/Inputs/TextField";
import { GridClassNames } from "../../../../../Components/Location/RegionControl";
import { ILocation, IRegion } from "../../../../../Components/Maps/Entities";
import { toPersianNumber } from "../../../../../Components/hooks/persianHelper";
import { IdropDownModel } from "../../../../../Components/Inputs/DropDown";
import { IResult } from "../../../../../Services/Entities";
import * as service from "../../../IService";

const gridClassNames: GridClassNames = {
  wrapper: "more-info-location-fields-grid-wrapper",
  item1: "more-info-location-fields-grid-item1",
  item2: "more-info-location-fields-grid-item2",
  item3: "more-info-location-fields-grid-item3",
};
type Props = {
  InsertNewAddress: (
    titleAddress: string,
    addressText: string,
    tempRegion: string[] | null,
    codeAdress: string,
    location: ILocation | null,
    area: IRegion | null,
    currentAddress: boolean
  ) => void;
};

function InsertAddress({ InsertNewAddress }: Props) {
  const matchesSm = useMediaQuery("(max-width:40rem)");
  const [area, setArea] = useState<IRegion | null>(null);
  const [titleAddress, setTitleAddress] = useState("");
  const [addressText, setAddressText] = useState("");
  const [codeAdress, setCodeAdress] = useState("");
  const [center, setCenter] = useState();
  const [location, setLocation] = useState<ILocation | null>(null);
  const [tempRegion, setTempRegion] = useState<string[] | null>(["", "", ""]);
  const [currentAddress, setCurrentAddress] = useState<boolean>(false);
  const [clickToInsert, setClickToInsert] = useState<boolean>(false);
  const [checkCity, setCheckCity] = useState<boolean>(false);
  const [checkState, setCheckState] = useState<boolean>(false);

  const onRegionChanged = (
    stateId: string,
    cityId: string,
    regionId: string
  ) => {
    if (stateId === "") {
      setTempRegion(null);
      return;
    }
    setTempRegion([stateId, cityId, regionId]);
  };

  const stateListFiller = async (loc: ILocation) => {
    const res: IResult = await service.getStatesList();
    let sta = res.Data.map((s: IdropDownModel) => ({
      id: s.id,
      name: toPersianNumber(s.name),
    }));
    let s = sta.find((i: IdropDownModel) => i.name === loc.selectRegion?.state);
    if (s === null || s === undefined || s.id === "") return;
    const respo: IResult = await service.getCitiesList(s.id);
    let cit = respo.Data.map((c: IdropDownModel) => ({
      id: c.id,
      name: toPersianNumber(c.name),
    }));
    let c = cit.find((i: IdropDownModel) => i.name === loc.selectRegion?.city);
    if (c === null || c === undefined || c.id === "") return;
    const response: IResult = await service.getRegionList(c.id);
    let reg = response.Data.map((r: IdropDownModel) => ({
      id: r.id,
      name: toPersianNumber(r.name),
    }));
    let r = reg.find(
      (i: IdropDownModel) => i.name === loc.selectRegion?.region
    );

    setArea({
      state: s?.id ?? "",
      city: c?.id ?? "",
      region: r?.id ?? "",
    });
  };

  const addNewAdress = () => {
    setClickToInsert(true);
    if (!tempRegion) {
      setCheckState(true);
      setCheckCity(true);
    } else if (tempRegion[1] === "") {
      setCheckCity(true);
      setCheckState(false);
    } else {
      setCheckCity(false);
      setCheckState(false);
    }
    if (
      titleAddress &&
      addressText &&
      tempRegion &&
      tempRegion[0] &&
      tempRegion[1]
    ) {
      InsertNewAddress(
        titleAddress,
        addressText,
        tempRegion,
        codeAdress,
        location,
        area,
        currentAddress
      );
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentAddress(event.target.checked);
  };

  return (
    <>
      <div className="address-form-more">
        <div className="address-form-more-wrapper-title">
          <div className="address-form-more-wrapper-title-item1">
            <TextField
              label="عنوان"
              multiline
              fullWidth
              value={toPersianNumber(titleAddress)}
              onTextChange={setTitleAddress}
              error={titleAddress === "" && clickToInsert}
              helperText={
                titleAddress === "" && clickToInsert ? "عنوان ضروری است" : ""
              }
            />
          </div>
        </div>
        <RegionControl
          {...{
            onRegionChanged,
            gridClassNames,
          }}
          validateCity={checkCity}
          validateState={checkState}
          area={area}
          cssRefactor
        />
        <div className="address-form-more-wrapper">
          <div className="address-form-more-wrapper-item1">
            <TextField
              label="جزییات (خیابان،کوچه،طبقه،واحد)"
              multiline
              fullWidth
              value={toPersianNumber(addressText)}
              onTextChange={setAddressText}
              error={addressText === "" && clickToInsert}
              helperText={
                addressText === "" && clickToInsert ? "جزییات ضروری است" : ""
              }
            />
          </div>
          <div className="address-form-more-wrapper-item2">
            <NumberText
              label="کد پستی"
              value={toPersianNumber(codeAdress)}
              onTextChanged={(e: any) => {
                setCodeAdress(e);
              }}
              maxLength={10}
            />
          </div>
          <div className="address-form-more-wrapper-item3">
            <FormControlLabel
              control={
                <Checkbox
                  checked={currentAddress}
                  onChange={handleChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="آدرس پیش فرض"
            />
          </div>
        </div>

        <div className="location-map-wrapper-address">
          <MapContainer
            canDelete
            userLocation
            center={center ? center : null}
            servantLocation={null}
            clientLocation={location}
            disabled={false}
            onLocationChange={(c: ILocation) => {
              setLocation(c);
              if (c) stateListFiller(c);
            }}
          />
          <p style={{ marginTop: "3%" }} className="upsert-location-hint">
            جهت راهنمایی بهتر به همیاران لطفا استان، شهر و محله انجام کار را
            وارد نمایید و یا موقعیت محل انجام کار را روی نقشه تعیین کنید
          </p>
        </div>
        <OurButton
          label="ثبت آدرس"
          size={matchesSm ? "sm" : "lg"}
          color="blue"
          onClick={addNewAdress}
        />
      </div>
    </>
  );
}
export default InsertAddress;
