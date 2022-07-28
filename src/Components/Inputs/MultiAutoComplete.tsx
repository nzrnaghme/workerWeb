import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { IdropDownModel } from "./DropDown";

type Props = {
  label: string;
  value: IdropDownModel[] | undefined;
  setValue: (_: any, value: (IdropDownModel | string)[]) => void;
  options: IdropDownModel[];
  required?: boolean;
  className?: string;
  limitTags?: number;
  freeSolo?: boolean;
  id?: string;
};

function MultiAutoCompleteHm({
  className,
  label,
  value,
  setValue,
  options,
  required,
  limitTags,
  freeSolo,
  id,
}: Props) {
  return (
    <Autocomplete
      limitTags={limitTags}
      multiple
      noOptionsText="هیچی"
      options={options}
      getOptionLabel={(option) => option.name}
      filterSelectedOptions
      value={value}
      onChange={setValue}
      size="small"
      className={className}
      fullWidth
      freeSolo={freeSolo}
      id={id}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          label={label}
          required={required}
        />
      )}
    />
  );
}

export default MultiAutoCompleteHm;
