import { RawAvatar } from "../../../Components/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Divider from "@material-ui/core/Divider";
import { IMobileNos } from "../../../RequestConfirm/Entities"; //TODO: Needs refactor.
import "./index.scss";
import { toPersianNumber } from "../../../Components/hooks/persianHelper";
import useMediaQuery from "@material-ui/core/useMediaQuery";

type Props = {
  isClient: boolean;
  userName: string;
  src: string;
  mobileNos: IMobileNos;
  onClick: () => void;
};

function AvatarName({ userName, mobileNos, isClient, src, onClick }: Props) {
  const matchesSm = useMediaQuery("(max-width:40rem)");

  return (
    <div
      className={`avatar-name-wrapper ${
        !matchesSm && "avatar-name-wrapper-lg"
      }`}
    >
      <ButtonBase className="avatar-btn" onClick={onClick}>
        <RawAvatar
          src={src ?? " "}
          size={!matchesSm ? "lg" : "sm"}
          personalCard
        />
      </ButtonBase>
      <div
        className={`name-mobile-wrapper ${
          !matchesSm && "name-mobile-wrapper-lg"
        }`}
      >
        <p onClick={onClick} className={`name ${"text-active"}`}>
          {userName}
        </p>

        {((mobileNos.clientNo && !isClient) ||
          (mobileNos.servantNo && isClient)) && (
          <Divider
            className={`name-mobile-divider ${
              !matchesSm && "name-mobile-divider-lg"
            }`}
          />
        )}
        <p className="mobile">
          {!isClient
            ? mobileNos.clientNo
              ? toPersianNumber(mobileNos.clientNo)
              : undefined
            : mobileNos.servantNo
            ? toPersianNumber(mobileNos.servantNo)
            : undefined}
        </p>
      </div>
    </div>
  );
}

export default AvatarName;
