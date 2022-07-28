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
import { IResult } from "../../../../../Services/Entities";
import { IdropDownModel } from "../../../../../Components/Inputs/DropDown";
import * as service from "../../../../../Users/ProfileUser/IService";
import { toPersianNumber } from "../../../../../Components/hooks/persianHelper";

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
  currentLocation: ILocation;
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
  const [tempLocation, setTempLocation] = useState<ILocation | null>(
    currentLocation
  );
  const [regionNames, setRegionNames] = useState<string[] | null>([]);
  const [center, setCenter] = useState();

  useEffect(() => {
    if (!open) return;

    if (currentState != "" && currentCity != "" && currentRegion != "") {
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

  useEffect(() => {
    submit();
  }, [tempLocation]);

  useEffect(() => {
    setArea({
      state: currentState,
      city: currentCity,
      region: currentRegion,
    });
  }, [currentState, currentRegion, currentCity]);

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
      location: tempLocation,
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

      <div className="location-map-wrapper">
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
          جهت راهنمایی بهتر به همیاران لطفا استان، شهر و محله انجام کار را وارد
          نمایید و یا موقعیت محل انجام کار را روی نقشه تعیین کنید
        </p>
      </div>
      <div className="location-btns-wrapper">
        <Button
          label="تایید"
          onClick={() => {
            if (tempLocation != location) setTempLocation(location);
            else submit();
          }}
          size={matchesSm ? "xs" : "sm"}
        />
        <Button
          label="انصراف"
          className="location-back-btn"
          onClick={onClose}
          size={matchesSm ? "xs" : "sm"}
          variant="outlined"
          color="red"
        />
      </div>
    </Popup>
  );
};

export default Modal;
