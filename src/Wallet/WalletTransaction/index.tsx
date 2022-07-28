import React, { useState } from "react";
import Paper from "../../Components/Paper";
import Button from "../../Components/Button";
import * as service from "./IServices";
import TransactionWalletGrid from "./Components/TransactionWalletGrid";
import { showLocalStorage } from "../../Routers/localStorage";
import "./index.scss";
import { IDateTransactionWallet, ITransactionWallet } from "./Entites";
import moment from "moment";
import { toast } from "react-toastify";
import DatePickerCustome from "../../Components/DateTimePicker/DatePickerPersian";
import { toEnglishNumber } from "../../Components/hooks/persianHelper";
import { trackPromise } from "react-promise-tracker";

function WalletTransaction() {
  const storageUser = showLocalStorage("user");

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const [allTransactions, setAllTransactions] = useState<
    ITransactionWallet[] | []
  >([]);
  const [showTransactions, setShowTransactions] = useState(false);
  const [emptyTransaction, setEmptyTransaction] = useState(false);

  const onSubmit = async () => {
    setEmptyTransaction(false);
    var InsertDateNow = moment(startDate).format("YYYY-MM-DD");
    var finishDate = moment(endDate).format("YYYY-MM-DD");
    if (endDate !== undefined && startDate !== undefined) {
      if (InsertDateNow > finishDate) {
        toast.warning("زمان اشتباه وارد شده است!");
        return;
      }
    }
    setShowTransactions(false);
    setAllTransactions([]);
    const DateForTransaction: IDateTransactionWallet = {
      userId: storageUser.Id,
      beginDate:
        startDate === undefined ? null : toEnglishNumber(InsertDateNow),
      endDate: endDate === undefined ? null : toEnglishNumber(finishDate),
    };
    let res = await service.postGetWalletTransactions(DateForTransaction);
    const transactionWallet = res.Data;
    if (transactionWallet.length === 0) {
      setEmptyTransaction(true);
      return;
    }
    setAllTransactions(transactionWallet);
    setShowTransactions(true);
  };

  return (
    <>
      <Paper className="transactions-serach-paper">
        <div className="transactions-serach-components">
          <DatePickerCustome
            label="از تاریخ"
            datePicker={startDate}
            onChangeDate={(s: Date) => {
              setAllTransactions([]);
              setStartDate(s);
            }}
            remove={() => {
              setAllTransactions([]);
              setStartDate(undefined);
            }}
            removable
          />

          <DatePickerCustome
            label="تا تاریخ"
            datePicker={endDate}
            onChangeDate={(s: Date) => {
              setAllTransactions([]);
              setEndDate(s);
            }}
            remove={() => {
              setAllTransactions([]);
              setEndDate(undefined);
            }}
            removable
          />
          <Button
            label="جستجو"
            onClick={() => {
              trackPromise(onSubmit());
            }}
            size="lg"
          />
        </div>
      </Paper>
      {showTransactions && (
        <TransactionWalletGrid allTransactionWallet={allTransactions} />
      )}
      {emptyTransaction && (
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
          در این بازه تراکنشی وجود ندارد.
        </div>
      )}
    </>
  );
}

export default WalletTransaction;
