import React from "react";

type Props = {
  children: React.ReactNode;
};

function ViewportCentralizer({ children }: Props) {
  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
}

export default ViewportCentralizer;
