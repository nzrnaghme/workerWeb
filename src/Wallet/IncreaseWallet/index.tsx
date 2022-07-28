import { useEffect, useRef, useState } from "react";
import "./index.scss";
import {
  toEnglishNumber,
  toPersianCurrency,
  toPersianNumber,
  wordsNumberofWallet,
} from "../../Components/hooks/persianHelper";
import { Formik, Field, Form } from "formik";
import * as yup from "yup";
import {
  getConfig,
  getWalletBallance,
  postGetAuthorityForPayment,
} from "./IService";
import Paper from "../../Components/Paper";
import Button from "../../Components/Button";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import { TextField } from "@material-ui/core";
import { showLocalStorage } from "../../Routers/localStorage";
// seperator
import { tools } from "./seperator-currency";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { IPayBank } from "../../Models/Entities";
import useSignalR from "../../Components/hooks/useSignalR";
import { WalletApi } from "../../config";
import { trackPromise } from "react-promise-tracker";

const neededAmountHint = (amount: string) => {
  return `برای ثبت یا انجام درخواست به حداقل
  ${toPersianCurrency(toPersianNumber(amount))} ریال نیاز است.`;
};

const allertStopIncrease =
  "با افزودن این مبلغ،موجودی کیف پول شما بیش از حد مجاز خواهد شد.";

function IncreaseWallet() {
  const matchesSm = useMediaQuery("(max-width:40rem)");
  const history = useHistory();
  const storageUser = showLocalStorage("user");
  const [walletBalance, setWalletBalance] = useState<number>();
  const [neededChargeAmount, setNeededChargeAmount] = useState<string>("");
  const [wordsWallet, setWordsWallet] = useState<string>();
  const [showWriteValue, setShowWriteValue] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const connectionInstanceMaker = useSignalR();
  const [connection, setConnection] = useState<signalR.HubConnection>();
  const [isConnected, setIsConnected] = useState(false);
  const currentWallet = useRef<number>();
  const MinimumAmount = useRef();

  useEffect(() => {
    if (storageUser === null) return;
    trackPromise(getPreConfig());
    trackPromise(getCurrentWalletBalance());
    onConnectionInstanceResolved();
  }, []);

  useEffect(() => {
    if (storageUser && isConnected) {
      connection?.on("IsPaySuccess", (isSuccess: boolean) => {
        if (isSuccess) {
          toast.success(
            `مبلغ ${toPersianCurrency(
              currentWallet.current!!
            )} ریال به کیف پول شما اضافه گردید`
          );
          getCurrentWalletBalance();
          return;
        } else {
          toast.error("پرداخت انجام نشد!");
        }
      });
    }
  }, [isConnected]);

  const onConnectionInstanceResolved = async () => {
    if (!connection) {
      const instance = await connectionInstanceMaker(
        storageUser.AccessToken,
        setIsConnected,
        WalletApi + "WalletHub"
      );
      setConnection(instance);
    }
  };

  const getPreConfig = async () => {
    const res = await getConfig();
    MinimumAmount.current = res.Data.cfgMinimumAmount;
    const { cfgRequestRegistrationPrice, cfgRequestRegistrationCancelPrice } =
      res.Data;
    setNeededChargeAmount(
      cfgRequestRegistrationPrice + cfgRequestRegistrationCancelPrice
    );
    setValue(
      toPersianCurrency(
        cfgRequestRegistrationPrice + cfgRequestRegistrationCancelPrice
      )
    );
  };

  const handleInput = (e: any) => {
    const v = e.target.value;
    const c = tools.toCurrencyFormat(v);
    const p = tools.toPersianDigits(c);
    setValue(p);
    setShowWriteValue(true);
    let endigit = toEnglishNumber(p.replace(",", ""));
    endigit = endigit.substring(0, endigit.length - 1);
    let digitToword = wordsNumberofWallet(endigit);
    setWordsWallet(digitToword.toString());
  };

  // Formik
  const validationSchema = yup.object().shape({
    chargeAmount: yup.string().required("مبلغ شارژ  الزامی است"),
  });

  const initialValues = {
    chargeAmount: toPersianCurrency(neededChargeAmount),
  };

  const onSubmit = async (values?: any) => {
    if (values.chargeAmount.includes(",")) {
      let chargeAmount = toEnglishNumber(values.chargeAmount);
      let EnglishchargeAmount = chargeAmount.replace(",", "");
      if (EnglishchargeAmount.includes(",")) {
        EnglishchargeAmount = EnglishchargeAmount.replace(",", "");
      }
      let inputchargeAmount = Number(EnglishchargeAmount);
      currentWallet.current = inputchargeAmount;
      if (inputchargeAmount < MinimumAmount.current!!) {
        toast.error(
          `حداقل مبلغ مجاز برای شارژ کیف پول ${toPersianCurrency(
            MinimumAmount.current!!
          )} ریال است.`
        );
        return;
      }
      increaseWalletBalance(inputchargeAmount);
    } else increaseWalletBalance(Number(toEnglishNumber(values.chargeAmount)));
  };

  const getCurrentWalletBalance = async () => {
    const res = await getWalletBallance(storageUser.Id);
    setWalletBalance(res.Data);
  };

  const increaseWalletBalance = async (amount: number) => {
    if (walletBalance) var Wallet = walletBalance + amount;
    else var Wallet = amount;
    if (Wallet > 10000000) {
      toast.error(allertStopIncrease);
      return;
    }
    const forBank: IPayBank = {
      userId: storageUser.Id,
      amount,
      description: `شارژ کیف پول - ${storageUser.MobileNo}`,
      callback_url: window.location.href + "?a=" + amount,
    };
    const resBank = await postGetAuthorityForPayment(forBank);

    if (resBank.Data) {
      window.open(`https://www.zarinpal.com/pg/StartPay/${resBank.Data}`);
    }
  };


  return (
    <Paper className="wallet-paper">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {(props) => (
          <Form noValidate className="wallet-paper-form-wrapper">
            <div className="wallet-paper-data-wrapper">
              <div className="wallet-ballence">
                <p>موجودی کیف پول</p>
                <p>
                  <span dir="ltr">{toPersianCurrency(walletBalance!)}</span>{" "}
                  ریال
                </p>
              </div>
              <Field
                as={TextField}
                value={value}
                onChange={(c: any) => {
                  let EnglishNatioanlCode = toEnglishNumber(c.target.value);
                  if (c.target.value === "") {
                    props.handleChange(c);
                    handleInput(c);
                  } else if (/^[0-9]+$/i.test(EnglishNatioanlCode)) {
                    handleInput(c);
                    props.handleChange(c);
                  } else if (/^[0-9]+[,]+[0-9]+$/i.test(EnglishNatioanlCode)) {
                    handleInput(c);
                    props.handleChange(c);
                  } else if (
                    /^[0-9]+[,]+[0-9]+[,]+[0-9]+$/i.test(EnglishNatioanlCode)
                  ) {
                    handleInput(c);
                    props.handleChange(c);
                  } else {
                    handleInput("");
                    props.handleChange("");
                  }
                }}
                id="outlined-required"
                name="chargeAmount"
                label="مبلغ شارژ"
                className="ChargeAmountInput"
                style={{ width: "100%" }}
                variant="standard"
                size="small"
                valueper={toPersianNumber(props.values.chargeAmount)}
                inputProps={{
                  inputMode: "tel",
                  dir: "ltr",
                  maxLength: 10,
                }}
                error={props.errors.chargeAmount && props.touched.chargeAmount}
                helperText={
                  wordsWallet && <p>{wordsWallet} تومان</p> &&
                  props.errors.chargeAmount ? (
                    <>{props.errors.chargeAmount}</>
                  ) : (
                    <>
                      {!showWriteValue && neededAmountHint(neededChargeAmount)}
                      {wordsWallet && <p>{wordsWallet} تومان</p>}
                    </>
                  )
                }
              />
            </div>
            <div className="wallet-paper-btns-wrapper">
              <div className="wallet-sumbit-btn-wrapper">
                <Button
                  label="شارژ کیف پول"
                  submit
                  size={matchesSm ? "sm" : "lg"}
                />
              </div>
              <div>
                <Button
                  label="بازگشت"
                  variant="outlined"
                  onClick={() => history.push("/")}
                  color="red"
                  size={matchesSm ? "sm" : "lg"}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Paper>
  );
}

export default IncreaseWallet;
