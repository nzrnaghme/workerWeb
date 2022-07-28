import { useEffect, useState } from "react";
import SimpleBar from "simplebar-react";
import Divider from "@material-ui/core/Divider";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { ICheckable } from "../Entites";
import Paper from "../../../Components/Paper/index";
import Chip from "../../../Components/Chip/index";
import Serach from "../../../Components/FiltersSearch";

type Props = {
  title: string;
  list: ICheckable[];
  onFilterChanged: (list: ICheckable[]) => void;
  searchable?: boolean;
  searchId?: string;
};

function SimpleFilter({ title, list, onFilterChanged, searchable }: Props) {
  const [filteredList, setFilteredList] = useState<ICheckable[]>();
  const [searchTxt, setSearchTxt] = useState("");

  useEffect(() => {
    if (list?.length > 0) setFilteredList(list);
    onSearchTxtChanged(searchTxt);
  }, [list]);

  const onSearchTxtChanged = (val: string) => {
    setSearchTxt(val);

    const filteredList = list.filter((i) => i.name.includes(val));
    setFilteredList(filteredList);
  };

  const listFilterHandler = (checked: boolean, id: string) => {
    const updatedCategories = list?.map((i) => {
      if (i.id === id) {
        i.isChecked = checked;
      }
      return i;
    });
    onFilterChanged(updatedCategories);
  };

  return (
    <Paper
      className={`filters-paper ${searchable && "filters-paper-has-search"}`}
    >
      <header className="filters-paper-header">
        {!searchable ? (
          <div className="filters-paper-title-wrapper">
            <p className="filters-paper-header-title">{title}</p>
          </div>
        ) : (
          <Serach
            label={title}
            value={searchTxt}
            onValueChanged={onSearchTxtChanged}
          />
        )}
        <div className="filters-paper-chips-wrapper">
          {list
            .filter((c) => c.isChecked)
            .map((i: ICheckable) => (
              <Chip
                key={i.id}
                label={i.name}
                onDelete={() => listFilterHandler(false, i.id)}
              />
            ))}
        </div>
      </header>
      <Divider className="filters-paper-divider" />
      <SimpleBar
        className={`filters-paper-body ${
          searchable && filteredList?.length! >= 4 && "filter-paper-long-body"
        }`}
        autoHide={false}
      >
        {filteredList?.map((i: ICheckable) => (
          <FormControlLabel
            key={i.id}
            control={
              <Checkbox
                checked={i.isChecked}
                onChange={(e) => listFilterHandler(e.target.checked, i.id)}
                color="primary"
                size="small"
              />
            }
            label={i.name}
          />
        ))}
      </SimpleBar>
    </Paper>
  );
}

export default SimpleFilter;
