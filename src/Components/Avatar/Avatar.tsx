import React from "react";
import Avatar from "@material-ui/core/Avatar";

type Props = {
  src: string;
  avatarSize?: number;
  onClick?: () => void;
  style?: React.CSSProperties;
};

function OurAvatar({ src, avatarSize = 8, onClick, style }: Props) {
  return (
    <Avatar
      src={src}
      onClick={onClick}
      style={{
        width: `${avatarSize}rem`,
        height: `${avatarSize}rem`,
        ...style,
      }}
    />
  );
}

export default OurAvatar;
