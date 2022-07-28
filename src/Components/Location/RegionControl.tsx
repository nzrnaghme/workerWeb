import { useEffect, useState } from "react";
import Autocomplete from "../Inputs/AutoCompleteY";
import { IdropDownModel } from "../Inputs/DropDown";
import * as service from "../../Users/ProfileUser/IService";
import { IResult } from "../../Services/Entities";
import { toPersianNumber } from "../hooks/persianHelper";
import { IRegion } from "../Maps/Entities";

type props = {
  area: IRegion | null;
  readOnly?: boolean;
  onRegionChanged?: (
    sId: string,
    cId: string,
    rId: string,
    sName?: string,
    cName?: string,
    rName?: string
  ) => void;
  cssRefactor?: boolean;
  gridClassNames?: GridClassNames;
  validateCity?: boolean;
  validateState?: boolean;
};
export interface GridClassNames {
  wrapper: string;
  item1: string;
  item2: string;
  item3: string;
}

export const gridClassNames: GridClassNames = {
  wrapper: "location-grid-wrapper",
  item1: "location-grid-item1",
  item2: "location-grid-item2",
  item3: "location-grid-item3",
};

function LocationWithOutMap({
  area,
  readOnly,
  onRegionChanged,
  gridClassNames,
  validateState,
  validateCity,
}: props) {
  const [currentArea, setCurrentArea] = useState<IRegion | null>(null);
  const [preArea, setPreArea] = useState<IRegion | null>(null);
  const [cities, setCities] = useState<IdropDownModel[]>([]);
  const [regions, setRegions] = useState<IdropDownModel[]>([]);
  const [states, setStates] = useState<IdropDownModel[]>([]);

  const [currentState, setCurrentState] = useState<
    IdropDownModel | undefined | null
  >({
    id: "",
    name: "",
  });

  const [currentCity, setCurrentCity] = useState<
    IdropDownModel | undefined | null
  >({
    id: "",
    name: "",
  });
  const [currentRegion, setCurrentRegion] = useState<
    IdropDownModel | undefined | null
  >({
    id: "",
    name: "",
  });

  useEffect(() => {
    fillStates();
  }, []);

  //state get out to set in component and find in list of states
  useEffect(() => {
    fillAddDropDown();
  }, [states]);

  useEffect(() => {
    fillAddDropDown();
  }, [currentArea]);

  useEffect(() => {
    setCurrentArea(area);
  }, [area]);

  //state get out to set in component and fill list of cities
  useEffect(() => {
    if (currentArea?.state != null && states.length > 0) {
      let s = states.find((s) => s.id === currentArea!.state);
      setCurrentState(s);
    } else setCurrentState(null);
  }, [states]);

  //select state in component and remove state causes remove regions
  useEffect(() => {
    if (currentState === null || !currentState || currentState.id === "") {
      setCurrentCity(null);
      setCurrentRegion(null);
      setCities([]);
      setRegions([]);
      callBack();
    } else {
      fillRegions(currentState.id);
      callBack();
    }
  }, [currentState]);

  //city get out to set in component and fill list of cities
  useEffect(() => {
    if (currentArea?.city != null && cities.length > 0) {
      let c = cities.find((c) => c.id === currentArea!.city);
      setCurrentCity(c);
    } else setCurrentCity(null);
  }, [cities]);

  //select city in component and remove city causes remove regions
  useEffect(() => {
    if (currentCity === null || !currentCity || currentCity.id === "") {
      setCurrentRegion(null);
      setRegions([]);
      callBack();
    } else {
      fillRegions(currentCity.id);
      callBack();
    }
  }, [currentCity]);

  //region get out to set in component and fill list of regions
  useEffect(() => {
    if (currentArea?.region != null && regions.length > 0) {
      let r = regions.find((c) => c.id === currentArea!.region);
      if (r === undefined) {
        setCurrentRegion(null);
      } else {
        setCurrentRegion(r);
      }
    } else {
      setCurrentRegion(null);
    }
  }, [regions]);

  useEffect(() => {
    callBack();
  }, [currentRegion]);

  const fillAddDropDown = () => {
    if (
      states.length === 0 ||
      currentArea === null ||
      currentArea === undefined
    )
      return;

    if (preArea?.state != currentArea?.state) {
      let state = states.find((c) => c.id === currentArea?.state);
      setCurrentState(state);
      setCurrentRegion(null);
      setCurrentCity(null);
      fillCities(currentArea?.state);
      setRegions([]);
      callBack();
    } else if (preArea?.city != currentArea?.city) {
      let city = cities.find((c) => c.id === currentArea?.city);
      setCurrentCity(city);
      setCurrentRegion(null);
    } else if (preArea?.region != currentArea?.region) {
      let region = regions.find((c) => c.id === currentArea?.region);
      setCurrentRegion(region);
    }
    setPreArea(currentArea);
  };

  const fillStates = async () => {
    const res: IResult = await service.getStatesList();
    let stateSelect = res.Data.map((s: IdropDownModel) => ({
      id: s.id,
      name: toPersianNumber(s.name),
    }));
    setStates(stateSelect);
  };

  const fillCities = async (stateId: string) => {
    if (stateId === null || stateId === undefined || stateId === "") return;

    const res: IResult = await service.getCitiesList(stateId);
    if (res.Data) {
      let citySelect = res.Data.map((c: IdropDownModel) => ({
        id: c.id,
        name: toPersianNumber(c.name),
      }));
      setCities(citySelect);
    }
  };

  const fillRegions = async (cityId: string) => {
    if (cityId === null || cityId === undefined || cityId === "") return;
    const res: IResult = await service.getRegionList(cityId);
    let regionSelect = res.Data.map((r: IdropDownModel) => ({
      id: r.id,
      name: toPersianNumber(r.name),
    }));
    setRegions(regionSelect);
  };

  //call back state , city and regions
  const callBack = () => {
    if (
      currentState === null &&
      currentCity === null &&
      currentRegion === null &&
      onRegionChanged != null
    ) {
      onRegionChanged("", "", "");
      return;
    }
    if (onRegionChanged != null)
      onRegionChanged(
        currentState?.id,
        currentCity?.id,
        currentRegion?.id,
        currentState?.name,
        currentCity?.name,
        currentRegion?.name
      );
  };

  return (
    <div className={gridClassNames!.wrapper}>
      <div className={gridClassNames!.item1}>
        <Autocomplete
          items={states}
          item={currentState!}
          onItemChange={(s) => {
            setCurrentArea({
              state: s?.id ?? "",
              city: "",
              region: "",
            });
          }}
          label="استان"
          error={validateState && !currentState}
          helperText={validateState && !currentState ? "استان ضروری است" : ""}
          disabled={readOnly}
        />
      </div>
      <div className={gridClassNames!.item2}>
        <Autocomplete
          items={cities}
          item={currentCity!}
          onItemChange={(c) => {
            let s = currentArea?.state ?? "";
            setCurrentArea({
              state: s,
              city: c?.id ?? "",
              region: "",
            });
          }}
          label="شهر"
          error={validateCity && !currentCity}
          helperText={validateCity && !currentCity ? "شهر ضروری است" : ""}
          disabled={readOnly}
        />
      </div>
      <div className={gridClassNames!.item3}>
        <Autocomplete
          label="محله"
          item={currentRegion!}
          onItemChange={(r) => {
            let s = currentArea?.state ?? "";
            let c = currentArea?.city ?? "";
            setCurrentArea({
              state: s,
              city: c,
              region: r?.id ?? "",
            });
          }}
          items={regions}
          disabled={readOnly}
        />
      </div>
    </div>
  );
}
export default LocationWithOutMap;
