import { useEffect, useState } from "react";
import Paper from "../../../Components/Paper";
import Serach from "../../../Components/FiltersSearch";
import Chip from "../../../Components/Chip/index";
import SimpleBar from "simplebar-react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import * as service from "../../../Users/ProfileUser/IService";
import { IResult } from "../../../Services/Entities";
import { IdropDownModel } from "../../../Components/Inputs/DropDown";
import { useHistory } from "react-router-dom";

type Props = {
  onFilterChanged: (sId: string, cId: string, rId: string) => void;
  LastSelect: string[];
};

function TabBtnsFilter({ onFilterChanged, LastSelect }: Props) {
  const history = useHistory();
  const [activeBtnId, setActiveBtnId] = useState(1);

  const [cities, setCities] = useState<IdropDownModel[]>([]);
  const [regions, setRegions] = useState<IdropDownModel[]>([]);
  const [states, setStates] = useState<IdropDownModel[]>([]);

  const [filteredRegions, setFilteredRegions] = useState<IdropDownModel[]>([]);
  const [filteredStates, setFilteredStates] = useState<IdropDownModel[]>([]);
  const [filteredCities, setFilteredCities] = useState<IdropDownModel[]>([]);

  const [stateId, setStateId] = useState<string | undefined>("");
  const [cityId, setCityId] = useState<string | undefined>("");
  const [regionId, setRegionId] = useState<string | undefined>("");

  const [searchTxt, setSearchTxt] = useState("");

  useEffect(() => {
    if (LastSelect) {
      if (LastSelect[0]) {
        onStateSelected(LastSelect[0]);
        radiosListmaker(filteredStates, LastSelect[0]);
      }
    }
  }, [states]);

  useEffect(() => {
    if (LastSelect) {
      if (LastSelect[1]) {
        onCitySelected(LastSelect[1]);
        radiosListmaker(filteredCities, LastSelect[1]);
      }
    }
  }, [cities]);

  useEffect(() => {
    if (LastSelect) {
      if (LastSelect[2]) {
        onRegionSelected(LastSelect[2]);
        radiosListmaker(filteredRegions, LastSelect[2]);
      }
    }
  }, [regions]);

  useEffect(() => {
    stateListFiller();
  }, []);

  useEffect(() => {
    if (states.length === 0) return;
    setFilteredStates(states);
  }, [states]);

  useEffect(() => {
    if (cities.length === 0) return;
    setFilteredCities(cities);
  }, [cities]);

  useEffect(() => {
    if (regions.length === 0) return;

    setFilteredRegions(regions);
  }, [regions]);

  useEffect(() => {
    setStateId("");
  }, [history.location]);

  useEffect(() => {
    if (stateId === "" || stateId === undefined) {
      onFilterChanged("", "", "");
      return;
    }
    if (cityId === "" || cityId === undefined) {
      onFilterChanged(stateId, "", "");
      return;
    }
    if (regionId === "" || regionId === undefined) {
      onFilterChanged(stateId, cityId, "");
      return;
    }
    onFilterChanged(stateId, cityId, regionId);
  }, [stateId, cityId, regionId]);

  const onSearchTxtChanged = (val: string) => {
    setSearchTxt(val);

    switch (activeBtnId) {
      case 1:
        const filteredStates = states.filter((i) => i.name.includes(val));
        setFilteredStates(filteredStates);
        break;
      case 2:
        const filteredCities = cities.filter((i) => i.name.includes(val));
        setFilteredCities(filteredCities);
        break;
      case 3:
        const filteredRegions = regions.filter((i) => i.name.includes(val));
        setFilteredRegions(filteredRegions);
        break;
    }
  };

  const stateListFiller = async () => {
    const res: IResult = await service.getStatesList();
    setStates(res.Data as IdropDownModel[]);
  };

  const cityListFiller = async (stateId: string) => {
    const res: IResult = await service.getCitiesList(stateId);
    setCities(res.Data as IdropDownModel[]);
  };

  const regionFiller = async (cityId: string) => {
    const res: IResult = await service.getRegionList(cityId);
    setRegions(res.Data as IdropDownModel[]);
  };

  const chipDeleteHandler = (id: string) => {
    setSearchTxt("");

    switch (id) {
      case stateId:
        setStateId("");
        setCityId("");
        setRegionId("");
        setCities([]);
        setRegions([]);
        setActiveBtnId(1);
        setFilteredStates(states);
        break;
      case cityId:
        setCityId("");
        setRegionId("");
        setRegions([]);
        setActiveBtnId(2);
        setFilteredCities(cities);
        break;
      default:
        setRegionId("");
        setFilteredRegions(regions);
    }
  };

  const chipGenerator = (list: IdropDownModel[], id: string | undefined) =>
    list.map((i: IdropDownModel) => {
      if (i.id !== id) return null;
      return (
        <Chip
          key={i.id}
          label={i.name}
          onDelete={() => chipDeleteHandler(i.id)}
        />
      );
    });

  const radiosListmaker = (list: any, setItemId: string | undefined) =>
    list?.map((i: any) => (
      <FormControlLabel
        value={i.id}
        control={
          <Radio size="small" color="primary" checked={i.id === setItemId} />
        }
        label={i.name}
      />
    ));

  const onStateSelected = (state: string) => {
    setStateId(state);
    cityListFiller(state);
    setCityId(undefined);
    setCities([]);
    setRegions([]);
    setRegionId(undefined);
  };

  const onCitySelected = (city: string) => {
    setCityId(city);
    regionFiller(city);
    setRegionId(undefined);
  };

  const onRegionSelected = (region: string) => setRegionId(region);

  const activeBtnClickHandler = (id: number) => {
    setSearchTxt("");

    switch (id) {
      case 1:
        setFilteredStates(states);
        break;
      case 2:
        setFilteredCities(cities);
        break;
      case 3:
        setFilteredRegions(regions);
        break;
    }

    setActiveBtnId(id);
  };

  return (
    <Paper className="filters-paper filters-paper-has-search">
      <header className="filters-paper-header">
        <Serach
          label="منطقه"
          value={searchTxt}
          onValueChanged={onSearchTxtChanged}
        />
        <div className="filters-paper-chips-wrapper">
          {chipGenerator(states, stateId)}
          {chipGenerator(cities, cityId)}
          {chipGenerator(regions, regionId)}
        </div>
      </header>
      <ButtonGroup
        variant="text"
        color="primary"
        className="filters-location-btn-group"
      >
        <Button
          className={`${activeBtnId === 1 && "activeBtn"}`}
          onClick={() => activeBtnClickHandler(1)}
        >
          استان
        </Button>
        <Button
          className={`${activeBtnId === 2 && "activeBtn"}`}
          onClick={() => activeBtnClickHandler(2)}
        >
          شهر
        </Button>
        <Button
          className={`${activeBtnId === 3 && "activeBtn"}`}
          onClick={() => activeBtnClickHandler(3)}
        >
          محله
        </Button>
      </ButtonGroup>
      <SimpleBar
        className="filters-paper-body filter-paper-long-body filter-paper-body-location"
        autoHide={false}
      >
        {activeBtnId === 1 ? (
          <RadioGroup
            value={stateId}
            onChange={(e) => onStateSelected(e.target.value)}
          >
            {radiosListmaker(filteredStates, stateId)}
          </RadioGroup>
        ) : activeBtnId === 2 ? (
          <RadioGroup
            value={cityId}
            onChange={(e) => onCitySelected(e.target.value)}
          >
            {radiosListmaker(filteredCities, cityId)}
          </RadioGroup>
        ) : (
          <RadioGroup
            value={regionId}
            onChange={(e) => onRegionSelected(e.target.value)}
          >
            {radiosListmaker(filteredRegions, regionId)}
          </RadioGroup>
        )}
      </SimpleBar>
    </Paper>
  );
}

export default TabBtnsFilter;
