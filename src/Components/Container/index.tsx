import { ReactChild } from "react";
import Container from "@material-ui/core/Container";
import "./index.scss";

type Props = { children: ReactChild | ReactChild[]; className?: string };

function YContainer({ children, className }: Props) {
  return (
    <Container maxWidth="lg" className={`${className} container`}>
      {children}
    </Container>
  );
}

export default YContainer;
