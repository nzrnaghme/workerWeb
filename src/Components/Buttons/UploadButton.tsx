import React from "react";
import Button from "@material-ui/core/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import FormHelperText from "@material-ui/core/FormHelperText";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      direction: "ltr",
      width: "100%",
      marginTop: "40px",
      color: "#898989",
      display: "flex",
      justifyContent: "space-between",
      padding: "0rem 0.5rem",
      fontSize: "21px",
      maxHeight: "37px",
    },
    text: {
      color: "#A0A0A0",
      fontSize: "15px",
    },
    label: {
      fontSize: "13px",
      whiteSpace: "nowrap",
    },
  })
);

type Props = {
  label: string;
  multiple?: boolean;
  onUploadingFile?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  uploadRef: React.RefObject<HTMLInputElement>;
  format?: string;
  helperText?: string;
  children?: any;
};

function UploadButtonY({
  label,
  multiple,
  onUploadingFile,
  onClick,
  uploadRef,
  format,
  helperText,
  children,
}: Props) {
  const classes = useStyles();
  return (
    <>
      <input
        hidden
        type="file"
        accept={format}
        multiple={multiple}
        onChange={onUploadingFile}
        value=""
        ref={uploadRef}
      ></input>
      <Button
        className={classes.root}
        variant="outlined"
        endIcon={<FontAwesomeIcon icon={faCloudUploadAlt} />}
        onClick={onClick}
      >
        <p className={classes.label}>{label}</p>
        {children}
      </Button>
      <FormHelperText className={classes.text}>{helperText}</FormHelperText>
    </>
  );
}

export default UploadButtonY;
