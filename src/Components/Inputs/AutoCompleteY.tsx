import Autocomplete from "@material-ui/lab/Autocomplete";
import FormHelperText from "@material-ui/core/FormHelperText";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { IdropDownModel } from "./DropDown";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: {
      fontSize: "15px",
    },
    hint: {
      color: "#A0A0A0",
    },
    err: {
      color: "red",
    },
  })
);

type Props = {
  label: string;
  item: IdropDownModel;
  onItemChange: (item: IdropDownModel | null) => void;
  items: IdropDownModel[];
  required?: boolean;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
};

function AutoComplete({
  className,
  label,
  item,
  onItemChange,
  items,
  required,
  disabled,
  helperText,
  error,
}: Props) {
  const classes = useStyles();
  return (
    <Autocomplete
      fullWidth
      disablePortal
      noOptionsText={"تعیین نشده"}
      autoHighlight
      options={items}
      getOptionLabel={(option) => option.name}
      filterSelectedOptions
      value={item}
      onChange={(e, r) => {
        onItemChange(r);
      }}
      size="small"
      className={className}
      disabled={disabled}
      style={{ overflow: "hidden" }} // It's width irrationally overflows, a bug by Mui.
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          label={label}
          required={required}
          error={error}
          helperText={helperText}
        >
          <FormHelperText
            className={`${classes.text} ${error ? classes.err : classes.hint}`}
          >
            {error ? helperText : ""}
          </FormHelperText>
        </TextField>
      )}
    />
  );
}

export default AutoComplete;
