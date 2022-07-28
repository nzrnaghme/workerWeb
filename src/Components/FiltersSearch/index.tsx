import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import ButtonBase from "@material-ui/core/ButtonBase";
import "./index.scss";

type Props = {
  label: string;
  value: string | undefined;
  onValueChanged: (val: string) => void;
};

function FiltersSearch({ label, value, onValueChanged }: Props) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const inputFocusHandler = () => {
    searchInputRef.current!.focus();
  };

  return (
    <div className="filters-search-wrapper">
      <input
        className="filters-search-input"
        type="text"
        placeholder={label}
        value={value}
        onChange={(e) => onValueChanged(e.target.value)}
        ref={searchInputRef}
      />
      <ButtonBase onClick={inputFocusHandler} className="filters-search-btn">
        <FontAwesomeIcon icon={faSearch} />
      </ButtonBase>
    </div>
  );
}

export default FiltersSearch;
