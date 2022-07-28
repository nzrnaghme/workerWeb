import { useEffect, useState } from "react";
import { faClock, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import "./index.scss";
import Divider from "@material-ui/core/Divider";
import Paper from "../../../../Components/Paper";
import HeaderItem from "../../../../Components/ReqPaperHeaderItem";
import {
  toPersianCurrency,
  toPersianNumber,
} from "../../../../Components/hooks/persianHelper";
import { titleWalletOperation } from "../../../../Registers/components/ReqPaperReqStatus/statusEnumContainer";
import { ITransactionWallet } from "../../Entites";
import { showLocalStorage } from "../../../../Routers/localStorage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

type Props = {
  allTransactionWallet: ITransactionWallet;
};

function TransactionWalletPaper({ allTransactionWallet }: Props) {
  const storageUser = showLocalStorage("user");
  const [time, setTime] = useState<string>();
  const [date, setDate] = useState<string>();

  useEffect(() => {
    if (storageUser != null) {
      DateTime();
    }
  }, []);

  const DateTime = () => {
    const data = allTransactionWallet.transactionDate;
    let splitDate = data.split(" ");
    setDate(toPersianNumber(splitDate[0]));
    setTime(toPersianNumber(splitDate[1]));
  };

  const persianText = (text: string | undefined) => {
    if (text) {
      return toPersianNumber(text);
    } else {
      return "";
    }
  };

  return (
    <Paper className="transaction-wallet-paper">
      <header className="transaction-wallet-paper-header">
        <div className="transaction-wallet-paper-status-wrapper">
          {allTransactionWallet.amount > 0 ? (
            <div className="status">
              <FontAwesomeIcon icon={faPlusCircle} color="green" />
              <span>افزایش موجودی</span>
            </div>
          ) : (
            <div className="status">
              <FontAwesomeIcon icon={faMinusCircle} color="red" />
              <span>کسر موجودی</span>
            </div>
          )}
          <HeaderItem icon={faClock}>
            <div className="transaction-wallet-paper-date-time">
              <span>{date}</span>
              <span className="datetime-dash-seperator">-</span>
              <span>{time}</span>
            </div>
          </HeaderItem>
        </div>
        <div className="t-w-paper-header-pay-detail">
          {titleWalletOperation(allTransactionWallet.walletOperation)}
        </div>
      </header>
      <Divider className="transaction-wallet-paper-main-divider" />
      <main className="transaction-wallet-paper-main">
        <div className="transaction-wallet-paper-content">
          <span>مبلغ تراکنش</span>
          <span
            className={`t-w-paper-content-2nd-span ${
              allTransactionWallet.amount > 0
                ? "wallet-increase"
                : "wallet-decrease"
            }`}
          >
            <span dir="ltr">
              {toPersianCurrency(allTransactionWallet.amount)}
            </span>
            <span>ریال</span>
          </span>
        </div>
        <div className="transaction-wallet-paper-content">
          <span>عنوان درخواست</span>
          <span className="t-w-paper-content-2nd-span">
            {allTransactionWallet.title
              ? toPersianNumber(allTransactionWallet.title)
              : "-----"}
          </span>
        </div>
      </main>
    </Paper>
  );
}

export default TransactionWalletPaper;
