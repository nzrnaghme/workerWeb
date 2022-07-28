import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { useEffect, useRef } from "react";
import "./index.scss";

type Props = {
  title?: string;
  children: React.ReactNode;
  open: boolean;
  onClose?: () => void;
  className?: string;
};

function Popup({ title, children, open, onClose, className }: Props) {
  const openPopUp = useRef(open);

  useEffect(() => {
    window.addEventListener("popstate", (event) => {
      if (openPopUp.current) {
        openPopUp.current = false;
        window.history.go(1);
      }
    });
  }, [openPopUp.current]);

  useEffect(() => {
    if (open) {
      openPopUp.current = true;
    } else openPopUp.current = false;
  }, [open]);

  return (
    <Dialog {...{ open, onClose, className }}>
      {title && <p className="popup-title">{title}</p>}
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}

export default Popup;
