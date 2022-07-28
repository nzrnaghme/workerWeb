import React from "react";
import Container from "@material-ui/core/Container";

type props = {
  children: any;
  className?: string;
  id?: string;
};

function ContainerY({ children, className, id }: props) {
  return (
    <Container
      maxWidth="sm"
      style={{
        maxWidth: "80vw",
        // minHeight: '100vh',
      }}
      className={className}
      id={id}
    >
      {children}
    </Container>
  );
}

export default ContainerY;
