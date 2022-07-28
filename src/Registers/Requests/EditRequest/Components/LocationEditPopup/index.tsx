import { useState, useEffect } from "react";
import "../../../LocationPopup.scss";
import Button from "../../../../../Components/Button";
import MapContainer from "../../../../../Components/Maps/MapContainer";
import Popup from "../../../../../Components/Popup";
import { ILocation, IRegion } from "../../../../../Components/Maps/Entities";
import RegionControl, {
  gridClassNames,
} from "../../../../../Components/Location/RegionControl";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { IdropDownModel } from "../../../../../Components/Inputs/DropDown";
import { toPersianNumber } from "../../../../../Components/hooks/persianHelper";
import { IResult } from "../../../../../Services/Entities";
import {
  getStatesList,
  getCitiesList,
  getRegionList,
} from "../../../../../Users/ProfileUser/IService";
export interface locationCallBack {
  state: string;
  city: string;
  region: string;
  location: ILocation | null;
  regionNames: string[] | null;
}

type Porps = {
  currentState: string;
  currentCity: string;
  currentRegion: string;
  currentLocation: ILocation | null;
  onConfirm: (location: locationCallBack) => void;
  open: boolean;
  onClose: () => void;
};

const Modal = ({
  currentState,
  currentCity,
  currentRegion,
  currentLocation,
  onConfirm,
  open,
  onClose,
}: Porps) => {
  const matchesSm = useMediaQuery("(max-width:40rem)");
  const [area, setArea] = useState<IRegion | null>(null);
  const [tempRegion, setTempRegion] = useState<string[]>([]);
  const [location, setLocation] = useState<ILocation | null>(currentLocation);
  const [regionNames, setRegionNames] = useState<string[] | null>([]);
  const [center, setCenter] = useState();

  useEffect(() => {
    if (open) {
      setArea({
        state: currentState ?? "",
        city: currentCity ?? "",
        region: currentRegion ?? "",
      });
      setLocation(currentLocation);
    }
  }, [open]);

  useEffect(() => {
    if (location) {
      setCenter([location.longitude, location.latitude]);
    }
  }, [location]);

  const stateListFiller = async (loc: ILocation) => {
    const res: IResult = await getStatesList();
    let sta = res.Data.map((s: IdropDownModel) => ({
      id: s.id,
      name: toPersianNumber(s.name),
    }));
    let s = sta.find((i: IdropDownModel) => i.name === loc.selectRegion?.state);
    if (s == null || s == undefined || s.id == "") return;
    const respo: IResult = await getCitiesList(s.id);
    let cit = respo.Data.map((c: IdropDownModel) => ({
      id: c.id,
      name: toPersianNumber(c.name),
    }));
    let c = cit.find((i: IdropDownModel) => i.name === loc.selectRegion?.city);
    if (c == null || c == undefined || c.id == "") return;
    const response: IResult = await getRegionList(c.id);
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

  const onRegionChanged = (
    stateId: string,
    cityId: string,
    regionId: string,
    stateName?: string,
    cityName?: string,
    regionName?: string
  ) => {
    setTempRegion([stateId, cityId, regionId]);
    setRegionNames([stateName!, cityName!, regionName!]);
  };

  const submit = () => {
    onConfirm({
      state: tempRegion[0],
      city: tempRegion[1],
      region: tempRegion[2],
      location: location,
      regionNames: regionNames,
    });
  };

  return (
    <Popup className="location-popup" {...{ open, onClose }}>
      <RegionControl
        {...{
          onRegionChanged,
          gridClassNames,
        }}
        area={area}
        cssRefactor
      />
      <p className="upsert-location-hint">
        جهت راهنمایی بهتر به همیاران لطفا استان، شهر و محله انجام کار را وارد
        نمایید و یا موقعیت محل انجام کار را روی نقشه تعیین کنید
      </p>
      <div className="location-map-wrapper">
        <MapContainer
          canDelete
          userLocation
          center={center ? center : null}
          clientLocation={location}
          disabled={false}
          servantLocation={null}
          onLocationChange={(c: ILocation) => {
            setLocation(c);
            if (c) stateListFiller(c);
          }}
        />
      </div>
      <div className="location-btns-wrapper">
        <Button label="تایید" onClick={submit} size={matchesSm ? "xs" : "sm"} />
        <Button
          label="انصراف"
          className="location-back-btn"
          onClick={onClose}
          size={matchesSm ? "xs" : "sm"}
          variant="outlined"
          color="blue"
        />
      </div>
    </Popup>
  );
};

export default Modal;
