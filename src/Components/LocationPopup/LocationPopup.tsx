import { useState, useEffect } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Button from "../Button";
import MapContainer from "../Maps/MapContainer";
import { ILocation, IRegion } from "../Maps/Entities";
import RegionControl, { gridClassNames } from "../Location/RegionControl";
import * as service from "../../Registers/WaitingToArrived/Service";
import { IResult } from "../../Services/Entities";
import { IdropDownModel } from "../Inputs/DropDown";
import { toPersianNumber } from "../hooks/persianHelper";
import {
  getStatesList,
  getCitiesList,
  getRegionList,
} from "../../Users/ProfileUser/IService";

export interface mapCallBack {
  isChanged: boolean;
  location?: ILocation | null;
  regionsName?: string[];
}

type props = {
  requestRegisteration: string;
  onConfirm: (map: mapCallBack) => void;
  handleClose: () => void;
  disabled?: boolean;
  isClient?: boolean;
};

const Modal = ({
  requestRegisteration,
  onConfirm,
  handleClose,
  disabled,
  isClient,
}: props) => {
  const matchesSm = useMediaQuery("(max-width:40rem)");
  const [area, setArea] = useState<IRegion | null>(null);
  const [tempRegion, setTempRegion] = useState<string[]>();
  const [tempLocation, setTempLocation] = useState<ILocation | null>();
  const [location, setLocation] = useState<ILocation | null>(null);
  const [filled, setFilles] = useState(false);
  const [center, setCenter] = useState();
  const [names, setNames] = useState<string[]>();

  useEffect(() => {
    locationInfo();
  }, []);

  useEffect(() => {
    if (location) {
      setCenter([location.longitude, location.latitude]);
    }
  }, [location]);

  const onRegionChanged = (
    stateId: string,
    cityId: string,
    regionId: string,
    stateName: string,
    cityName: string,
    regionName: string
  ) => {
    setTempRegion([stateId, cityId, regionId]);
    setNames([stateName, cityName, regionName]);
  };

  const locationInfo = async () => {
    let locationInfo = await service.getRequestLocationInfo(
      requestRegisteration!
    );
    if (locationInfo.Data.region) {
      if (locationInfo.Data.region.length >= 0) {
        setArea((prev) => ({
          state: locationInfo.Data.region[0] ?? "",
          city: prev?.city ?? "",
          region: prev?.region ?? "",
        }));
        if (locationInfo.Data.region.length >= 1) {
          setArea((prev) => ({
            state: prev?.state ?? "",
            city: locationInfo.Data.region[1] ?? "",
            region: prev?.region ?? "",
          }));
          if (locationInfo.Data.region.length >= 2) {
            setArea((prev) => ({
              state: prev?.state ?? "",
              city: prev?.city ?? "",
              region: locationInfo.Data.region[2] ?? "",
            }));
          }
        }
      }
    }
    setTempLocation(locationInfo.Data.location);
    setLocation(locationInfo.Data.location);
    setFilles(true);
  };

  const regionHandler = (regions: string[]) => {
    if (regions[0] === undefined || regions[0] === "") {
      return null;
    }
    if (regions[1] === undefined || regions[1] === "") {
      return [regions[0], null, null];
    }
    if (regions[2] === undefined || regions[2] === "") {
      return [regions[0], regions[1], null];
    }
    return [regions[0], regions[1], regions[2]];
  };

  const stateListFiller = async (loc: ILocation) => {
    const res: IResult = await getStatesList();
    let sta = res.Data.map((i: IdropDownModel) => ({
      id: i.id,
      name: toPersianNumber(i.name),
    }));
    let s: IdropDownModel = sta.find(
      (i: IdropDownModel) => i.name === loc.selectRegion?.state
    );
    if (s === null || s === undefined || s.id === "") return;
    const respo: IResult = await getCitiesList(s.id);
    let cit = respo.Data.map((i: IdropDownModel) => ({
      id: i.id,
      name: toPersianNumber(i.name),
    }));
    let c: IdropDownModel = cit.find(
      (i: IdropDownModel) => i.name === loc.selectRegion?.city
    );
    if (c === null || c === undefined || c.id === "") return;
    const response: IResult = await getRegionList(c.id);
    let reg = response.Data.map((i: IdropDownModel) => ({
      id: i.id,
      name: toPersianNumber(i.name),
    }));
    let r: IdropDownModel = reg.find(
      (i: IdropDownModel) => i.name === loc.selectRegion?.region
    );
    if (s) {
      if (c) {
        if (r) {
          setNames([s.name, c.name, r.name]);
        }
      } else {
        setNames([s.name, "", ""]);
      }
    } else {
      setNames(["", "", ""]);
    }

    setArea({
      state: s?.id ?? "",
      city: c?.id ?? "",
      region: r?.id ?? "",
    });
  };

  const updateLocation = async (
    state: string,
    city: string,
    region: string,
    location: ILocation | null
  ) => {
    let regions = regionHandler([state, city, region]);
    let res = await service.updateRequestLocationInfo({
      requestRegistrationId: requestRegisteration!,
      region: regions,
      location: location,
      locationName: location ? location.name : "",
    });
  };

  const submit = () => {
    const testLocationChanged = () => {
      if (tempLocation) {
        if (location) {
          if (tempLocation.latitude != location.latitude) return true;
          else return false;
        } else {
          return true;
        }
      } else {
        if (location) return true;
        else return false;
      }
    };
    const isUpdated = testLocationChanged();
    var s;
    var c;
    var r;
    if (tempRegion![0] === undefined) s = "";
    else s = tempRegion![0];

    if (tempRegion![1] === undefined) c = "";
    else c = tempRegion![1];

    if (tempRegion![2] === undefined) r = "";
    else r = tempRegion![2];

    if (area?.state != s || area?.city != c || area?.region != r || isUpdated) {
      updateLocation(s, c, r, location);
      onConfirm({
        isChanged: true,
        location: location ? location : null,
        regionsName: names,
      });
    }
    onConfirm({
      isChanged: false,
    });
  };

  return (
    <>
      {filled && (
        <>
          <RegionControl
            {...{
              readOnly: disabled,
              onRegionChanged,
              gridClassNames,
            }}
            area={area}
            cssRefactor
          />
          <div className="location-map-wrapper">
            {location || isClient ? (
              <MapContainer
                canDelete={!disabled}
                userLocation={!disabled}
                center={center ? center : null}
                servantLocation={null}
                clientLocation={location}
                disabled={disabled} //just client can set && before servant start working
                onLocationChange={(c: ILocation) => {
                  setLocation(c);
                  if (c) stateListFiller(c);
                }}
              />
            ) : (
              <p>موقعیت مکانی تعیین نشده است</p>
            )}
          </div>
          <div
            className={`location-btns-wrapper ${
              disabled && "location-single-btn-wrapper"
            }`}
          >
            {!disabled && (
              <Button
                onClick={submit}
                size={matchesSm ? "xs" : "sm"}
                label="تایید"
              />
            )}
            <Button
              onClick={handleClose}
              label="بازگشت"
              size={matchesSm ? "xs" : "sm"}
              color="blue"
              variant="outlined"
              className={!disabled ? "location-back-btn" : undefined}
            />
          </div>
        </>
      )}
    </>
  );
};
export default Modal;
