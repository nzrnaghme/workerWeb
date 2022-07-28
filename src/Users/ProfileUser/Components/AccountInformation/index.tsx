import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import "./index.scss";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Paper from "../../../../Components/Paper";
import { TextField } from "@material-ui/core";
import NumberText from "../../../../Components/Inputs/NationalCode";
import Button from "../../../../Components/Button";
import {
  toPersianCurrency,
  toPersianNumber,
} from "../../../../Components/hooks/persianHelper";
import { IUserInfo } from "../../Entities";
import TypeOfBank from "../../../../Components/TypeOfBank";

type Props = {
  personalData: IUserInfo | undefined;
  creditCardUpdateHandler: (
    cardNumber1: string | undefined,
    cardNumberNo2: string | undefined,
    isValidCard1: boolean,
    isValidCard2: boolean
  ) => void;
  credit: string | undefined;
};

function Accountinformation({
  personalData,
  creditCardUpdateHandler,
  credit,
}: Props) {
  const matchesSm = useMediaQuery("(max-width:40rem)");

  const [creditCard, setCreditCard] = useState<string>("");
  const [secondCreditCard, setSecondCreditCard] = useState<string>("");
  const isValidCard1 = useRef(false);
  const isValidCard2 = useRef(false);

  useEffect(() => {
    if (personalData != null) {
      setCreditCard(personalData.cardNumber1);
      setSecondCreditCard(personalData.cardNumberNo2);
    }
  }, [personalData]);

  const persianText = (text: any) => {
    if (text) {
      return toPersianCurrency(toPersianNumber(text));
    }
    return toPersianNumber(0);
  };

  const bankIconMakerCard1 = (creditCard: string) => {
    if (TypeOfBank(creditCard) === "") {
      isValidCard1.current = false;
      return <FontAwesomeIcon icon={faCreditCard} />;
    }
    isValidCard1.current = true;
    return <img src={TypeOfBank(creditCard)} alt="" />;
  };

  const bankIconMakerCard2 = (creditCard: string) => {
    if (TypeOfBank(creditCard) === "") {
      isValidCard2.current = false;
      return <FontAwesomeIcon icon={faCreditCard} />;
    }
    isValidCard2.current = true;
    return <img src={TypeOfBank(creditCard)} alt="" />;
  };

  return (
    <Paper className="profile-paper">
      <p className="profile-paper-title">اطلاعات حساب</p>
      <TextField
        label="موجودی به ریال"
        value={persianText(credit)}
        disabled
        variant="standard"
        size="small"
        inputProps={{ dir: "ltr" }}
        fullWidth
      />
      <div className="credit-card-wrapper">
        <NumberText
          label="شماره کارت "
          value={creditCard}
          onTextChanged={setCreditCard}
          mask="$$$$ $$$$ $$$$ $$$$"
          maskChar="$"
        />
        <div className="c-c-bank-icon-wrapper">
          {bankIconMakerCard1(creditCard)}
        </div>
      </div>
      <div className="credit-card-wrapper">
        <NumberText
          label="شماره کارت دوم"
          value={secondCreditCard}
          onTextChanged={setSecondCreditCard}
          mask="$$$$ $$$$ $$$$ $$$$"
          maskChar="$"
        />
        <div className="c-c-bank-icon-wrapper">
          {bankIconMakerCard2(secondCreditCard)}
        </div>
      </div>
      <div className="profile-paper-btn-wrapper">
        <Button
          label="ذخیره"
          onClick={() => {
            creditCardUpdateHandler(
              creditCard,
              secondCreditCard,
              isValidCard1.current,
              isValidCard2.current
            );
          }}
          size={matchesSm ? "sm" : "lg"}
        />
      </div>
    </Paper>
  );
}
export default Accountinformation;
