import React from "react";
import Avatar from "./Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

const fabStyles = (fabSize: number) => ({
  width: `${fabSize}rem`,
  height: `${fabSize}rem`,
  border: `${fabSize * 0.1}rem solid white`,
  borderRadius: "50%",
  color: "white",
  position: "absolute" as "absolute",
});

const deleteFabPositioner = (fabSize: number) => ({
  right: `calc(-1 * ${fabSize}rem / 2)`,
  top: `calc(50% - ${fabSize}rem / 2)`,
  background: "red",
});

const EditFabPositioner = (fabSize: number, avatarSize: number) => ({
  top: `calc(50% - ${fabSize}rem / 2)`,
  right: `calc(50% - ${fabSize}rem / 2)`,
  transform: `rotate(45deg) translateX(${avatarSize / 2}rem)`,
  background: "#1dc466",
});

type Props = {
  src: string;
  avatarSize?: number;
  fabSize?: number;
  onUploadingImg: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpsertClicked: () => void;
  onDeleteClicked: () => void;
  upsertRef: React.RefObject<HTMLInputElement>;
};

function EditableAvatar({ avatarSize = 8, fabSize = 2.6, ...props }: Props) {
  return (
    <span
      style={{
        position: "relative",
        height: "fit-content",
        width: "fit-content",
      }}
    >
      <Avatar src={props.src} {...{ avatarSize }} />
      {props.src !== " " && (
        <ButtonBase
          style={{ ...fabStyles(fabSize), ...deleteFabPositioner(fabSize) }}
          onClick={props.onDeleteClicked}
        >
          <DeleteIcon />
        </ButtonBase>
      )}
      <input
        hidden
        type="file"
        accept="image/*"
        onChange={props.onUploadingImg}
        value=""
        ref={props.upsertRef}
      />
      <ButtonBase
        style={{
          ...fabStyles(fabSize),
          ...EditFabPositioner(fabSize, avatarSize),
        }}
        onClick={props.onUpsertClicked}
      >
        <EditIcon style={{ transform: "rotate(-45deg)" }} />
      </ButtonBase>
    </span>
  );
}

export default EditableAvatar;
