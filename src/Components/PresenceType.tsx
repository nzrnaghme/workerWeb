import React from "react";
import { PresenceTypeCategory } from "../Models/Enums";

type props = {
  Presence: PresenceTypeCategory | undefined;
  className?: string;
};

function PresenceType({ Presence, className }: props) {
  const view = (Presence: PresenceTypeCategory | undefined) => {
    switch (Presence) {
      case 0:
        return "حضوری";
      case 1:
        return "غیرحضوری";
    }
  };
  return <div className={className}>{view(Presence)}</div>;
}

export default PresenceType;
