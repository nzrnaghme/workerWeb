import React from "react";
import { Redirect, Route } from "react-router";
import { showLocalStorage } from "./localStorage";
import * as services from "./IServices";
import { ICheckPayBank, ICheckPayBankConfirm } from "./IServices";

const PrivateRoute = ({ component, ...rest }: any) => {
  const storageUser = showLocalStorage("user");

  const isAuthenticated = (path: string) => {
    return storageUser?.Id != null && storageUser?.Id != "";
  };

  const PayAddRequest = async (forCheckPay: ICheckPayBank) => {
    const resCheckPay = await services.postVerifyAuthorityAddRequest(
      forCheckPay
    );
    window.close();
  };

  const PayWallet = async (forCheckPay: ICheckPayBank) => {
    const resCheckPay = await services.postVerifyAuthorityWallet(forCheckPay);
    window.close();
  };

  const PayRequestConfirm = async (forCheckPay: ICheckPayBankConfirm) => {
    const resCheckPay = await services.postVerifyAuthorityRequestConfirm(
      forCheckPay
    );
    window.close();
  };

  const isAnswerWalletFromBank = async (props: any) => {
    const AutorithyForBank = props.location.search.split("=")[2].split("&")[0];
    const amount = props.location.search.split("=")[1].split("&")[0];
    const RequestRegistrationId = props.location.search
      .split("=")[2]
      .split("&")[0];
    const forCheckPay: ICheckPayBank = {
      userId: storageUser.Id,
      amount,
      authority: AutorithyForBank,
    };
    switch (props.match.path) {
      case "/AddRequest":
        PayAddRequest(forCheckPay);
        break;
      case "/IncreaseWallet":
        PayWallet(forCheckPay);
        break;
      case "/requestconfirm/:idType/:reqConfirmId":
        const BackFormFunction = props.location.search
          .split("=")[3]
          .split("&")[0];
        const AutorithyForBankConfirm = props.location.search
          .split("=")[4]
          .split("&")[0];
        const forCheckPayConfirm: ICheckPayBankConfirm = {
          userId: storageUser.Id,
          amount,
          authority: AutorithyForBankConfirm,
          RequestRegistrationId,
          url: BackFormFunction === "true" ? true : false,
        };
        PayRequestConfirm(forCheckPayConfirm);
        break;
    }
  };

  const routeComponent = (props: any) => {
    if (
      window.location.href.includes("Status") &&
      window.location.href.includes("Authority")
    ) {
      isAnswerWalletFromBank(props);
      return;
    }
    if (props.match.path === "/") return React.createElement(component, props);
    if (props.match.path === "/Login") {
      if (
        storageUser === null ||
        storageUser?.Id == null ||
        storageUser?.Id == "" ||
        storageUser?.Id.lenght <= 1
      ) {
        return React.createElement(component, props);
      } else return <Redirect to={{ pathname: "/" }} />;
    }

    if (props.match.path === "/RegisterUser") {
      if (storageUser?.MobileNo && !storageUser?.Id)
        return React.createElement(component, props);
      else return <Redirect to={{ pathname: "/" }} />;
    }

    return isAuthenticated(props.match.path) ? (
      React.createElement(component, props)
    ) : (
      <Redirect to={{ pathname: "/Login" }} />
    );
  };

  return <Route {...rest} render={routeComponent} />;
};

export default PrivateRoute;
