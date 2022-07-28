import { useEffect } from "react";

type Props = {
  text: string;
};

function EmptyData({ text }: Props) {
  // if (!text) return <div></div>;
  return (
    <div
      style={{
        padding: "1rem",
        boxShadow:
          "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
        height: "fit-content",
        borderRadius: "0.5rem",
        boxSizing: "border-box",
      }}
    >
      {text}
    </div>
  );
}

export default EmptyData;
