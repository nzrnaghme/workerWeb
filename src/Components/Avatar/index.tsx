import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import "./index.scss";

type RawAvatarProps = {
  src: string | null;
  size?: "lg" | "sm";
  className?: string;
  verifiedPictureUser?: boolean;
  rejectedPicture?: boolean;
  personalCard?: boolean;
};

export function RawAvatar({
  src,
  size = "lg",
  className,
  verifiedPictureUser,
  personalCard,
  rejectedPicture,
}: RawAvatarProps) {
  return (
    <>
      {verifiedPictureUser === false && src != null ? (
        rejectedPicture === false ? (
          <>
            <div className="check-support">
              <span className="title-check-support">درحال بررسی...</span>
            </div>
            <Avatar
              className={`${
                size === "lg" ? "lg-avatar" : "sm-avatar"
              } ${className} 
           `}
              src={src!}
            />
          </>
        ) : (
          <>
            <div className="check-support">
              <span className="title-check-support-reject">تایید نشد</span>
            </div>
            <Avatar
              className={`${
                size === "lg" ? "lg-avatar" : "sm-avatar"
              } ${className} 
           `}
              src={src!}
            />
          </>
        )
      ) : (
        <Avatar
          className={`${
            size === "lg" ? "lg-avatar" : "sm-avatar"
          } ${className} `}
          src={src === null ? undefined : src}
        />
      )}
    </>
  );
}

type EditableAvatarProps = {
  verifiedPictureUser: boolean;
  rejectedPicture?: boolean;
  src: string | null;
  className?: string;
  onUploadingImg: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpsertClicked: () => void;
  onDeleteClicked: () => void;
  upsertRef: React.RefObject<HTMLInputElement>;
};

export function EditableAvatar({ ...props }: EditableAvatarProps) {
  return (
    <div className="editable-avatar-wrapper">
      <RawAvatar
        src={props.src}
        verifiedPictureUser={props.verifiedPictureUser}
        rejectedPicture={props.rejectedPicture}
      />
      {props.src !== null && props.verifiedPictureUser && (
        <ButtonBase className="delete-fab" onClick={props.onDeleteClicked}>
          <FontAwesomeIcon id="trash-icon" icon={faTrash} />
        </ButtonBase>
      )}
      <input
        hidden
        type="file"
        accept="image/*"
        onChange={props.onUploadingImg}
        ref={props.upsertRef}
      />
      <ButtonBase className="edit-fab" onClick={props.onUpsertClicked}>
        <FontAwesomeIcon id="pen-icon" icon={faPen} />
      </ButtonBase>
    </div>
  );
}

export default EditableAvatar;
