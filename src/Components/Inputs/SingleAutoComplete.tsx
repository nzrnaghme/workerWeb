import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { IdropDownModel } from "../../Components/Inputs/DropDown";

type Props = {
  label: string;
  value: string | IdropDownModel | null | undefined;
  setValue: (_: any, value: IdropDownModel | string | null) => void;
  options: IdropDownModel[];
  required?: boolean;
  autoHighlight?: boolean;
  className?: string;
};

function SingleAutoComplete({
  label,
  value,
  setValue,
  options,
  required,
  className,
  autoHighlight,
}: Props) {
  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => (option as IdropDownModel).name}
      value={value}
      onChange={setValue}
      size="small"
      fullWidth
      noOptionsText="هیچی"
      className={className}
      autoHighlight={autoHighlight}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          style={{ overflow: "hidden" }}
          label={label}
          required={required}
        />
      )}
    />
  );
}

export default SingleAutoComplete;
