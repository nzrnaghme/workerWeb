import "./index.scss";
import { useEffect, useRef, useState } from "react";
import ButtonBase from "@material-ui/core/ButtonBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { IdropDownModel } from "../../Components/Inputs/DropDown";
import { IResult } from "../../Services/Entities";
import * as service from "../../Users/ProfileUser/IService";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { showLocalStorage } from "../../Routers/localStorage";
import {
  toEnglishNumber,
  toPersianNumber,
} from "../../Components/hooks/persianHelper";
import { RootFilter } from "../../Models/Enums";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import FullDialog from "../../Components/FullDialog";
import OurTextField from "../../Components/TextField";
import OurAutoComplete from "../../Components/Inputs/SingleAutoComplete";

const categoryOptions = [
  { name: "همه گروه ها", id: RootFilter.All },
  { name: "روزمره", id: RootFilter.NormalFilter },
  { name: "فوری", id: RootFilter.EmergencyFilter },
  { name: "پیشنهادی", id: RootFilter.Suggestion },
];

type SearchFieldProps = {
  label: string;
  value: string;
  onTextChanged: (val: string) => void;
  clickEnter: (e: any) => void;
};

function SearchField({
  label,
  value,
  onTextChanged,
  clickEnter,
}: SearchFieldProps) {
  return (
    <div>
      <TextField
        label={label}
        onKeyDown={clickEnter}
        value={value}
        onChange={(e) => onTextChanged(e.target.value)}
        variant="outlined"
        fullWidth
        className="search-field"
      />
    </div>
  );
}

type ComboBoxProps = {
  label: string;
  options: IdropDownModel[];
  value: string | IdropDownModel | null | undefined;
  onItemFinded: (_: any, val: IdropDownModel | string | null) => void;
};

function ComboBox({ label, value, onItemFinded, options }: ComboBoxProps) {
  return (
    <div>
      <Autocomplete
        options={options}
        getOptionLabel={(option) => option.name}
        onChange={onItemFinded}
        renderInput={(params) => (
          <TextField
            value={value}
            {...params}
            fullWidth
            label={label}
            variant="outlined"
            className="combo-field"
          />
        )}
      />
    </div>
  );
}

type Props = {
  searchDialoqOpen?: boolean;
  onSearchCancel?: () => void;
};

function Search({ searchDialoqOpen, onSearchCancel }: Props) {
  const storageUser = showLocalStorage("user");
  const history = useHistory();
  const matchesSm = useMediaQuery("(max-width:40rem)");
  const [searchVal, setSearchVal] = useState("");
  const [states, setStates] = useState<IdropDownModel[]>([]);
  const [category, setCategory] = useState<IdropDownModel | string | null>();
  const [state, setState] = useState<IdropDownModel | string | null>();

  const openPopUp = useRef(searchDialoqOpen);

  useEffect(() => {
    window.addEventListener("popstate", (event) => {
      if (openPopUp.current) {
        openPopUp.current = false;
        window.history.go(1);
      }
    });
  }, [openPopUp.current]);

  useEffect(() => {
    if (searchDialoqOpen) {
      openPopUp.current = true;
    } else openPopUp.current = false;
  }, [searchDialoqOpen]);

  useEffect(() => {
    stateListFiller();
  }, []);

  const stateListFiller = async () => {
    const res: IResult = await service.getStatesList();
    setStates(res.Data as IdropDownModel[]);
  };

  const search = () => {
    history.push(
      `/SearchRequestList/${storageUser ? storageUser.Id : null}/${
        searchVal ? toEnglishNumber(searchVal) : null
      }/${category ? (category as IdropDownModel)?.id : null}/${
        state ? (state as IdropDownModel)?.id : null
      }`
    );
  };

  const desktop = (
    <div className="search-container">
      <div className="search-fields-wrapper">
        <SearchField
          label="جستجو..."
          value={toPersianNumber(searchVal)}
          onTextChanged={setSearchVal}
          clickEnter={(e: any) => {
            if (e.key === "Enter") search();
          }}
        />
        <ComboBox
          value={category}
          onItemFinded={(_, val) => setCategory(val)}
          label="همه گروه ها"
          options={categoryOptions}
        />
        <ComboBox
          value={state}
          onItemFinded={(_, val) => setState(val)}
          label="محدوده مکانی"
          options={states}
        />
      </div>
      <ButtonBase className="search-button" onClick={search}>
        جستجو
        <FontAwesomeIcon id="search-icon" icon={faSearch} />
      </ButtonBase>
    </div>
  );

  const mobile = (
    <FullDialog
      label="جستجو"
      open={searchDialoqOpen!}
      onConfirm={search}
      onCancel={onSearchCancel!}
    >
      <div className="mobile-search-fields">
        <OurTextField
          label="جستجو..."
          value={toPersianNumber(searchVal)}
          onTextChange={setSearchVal}
        />
        <OurAutoComplete
          label="همه گروه ها"
          value={category}
          setValue={(_, val) => setCategory(val)}
          options={categoryOptions}
        />
        <OurAutoComplete
          label="محدوده مکانی"
          value={state}
          setValue={(_, val) => setState(val)}
          options={states}
        />
      </div>
    </FullDialog>
  );

  return matchesSm ? mobile : desktop;
}

export default Search;
