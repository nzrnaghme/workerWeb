import { createContext, useContext } from "react";
import { IUserLogin } from "./Entities";

export type GeneralContextType = {
  userLogin: IUserLogin | undefined;
  setUserLogin: (userLogin: IUserLogin) => void;

  confirmTitle?: string;
  confirmMsg: string;
  confirmCallback: () => void;
  rejectCallback?: () => void;
  confirmPopupOpen: boolean;
  setConfirmPopupOpen: (open: boolean) => void;
  onConfirmSetter: (
    msg: string,
    confirmCallback: () => void,
    rejectCallback?: () => void,
    title?: string
  ) => void;
};

export const GeneralContext = createContext<GeneralContextType>({
  userLogin: undefined,
  setUserLogin: (user) => console.warn("no user provider"),
  confirmPopupOpen: false,
  setConfirmPopupOpen: () => { },
  confirmTitle: "",
  confirmMsg: "",
  confirmCallback: () => { },
  rejectCallback: () => { },
  onConfirmSetter: (msg, confirmCallback, rejectCallback, title) => { },
});

export const useGeneralContext = () => useContext(GeneralContext);
