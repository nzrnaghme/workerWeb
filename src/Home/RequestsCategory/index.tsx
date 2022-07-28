import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReqsGrid from "./ReqGrid";
import "./index.scss";
import emergent from "../../Images/root/Offer-2.png";
import suggested from "../../Images/root/Offer-3.png";
import daily from "../../Images/root/Offer-1.png";
import ButtonBase from "@material-ui/core/ButtonBase";
import { useHistory } from "react-router-dom";
import * as service from "../service";
import * as ServiceAccept from "../../Registers/DailyRequestContainList/IService";
import { toast } from "react-toastify";
import { IPresentableRequest } from "../../Registers/DailyRequestContainList/Entities";
import { showLocalStorage } from "../../Routers/localStorage";

export enum ReqsCategoryType {
  Emergent = "emergent",
  Suggested = "suggested",
  Daily = "daily",
}

// Temporal func
const iconIdentifier = (type: ReqsCategoryType) => {
  switch (type) {
    case ReqsCategoryType.Emergent:
      return emergent;
    case ReqsCategoryType.Suggested:
      return suggested;
    case ReqsCategoryType.Daily:
      return daily;
  }
};

const persianTitleMaker = (type: ReqsCategoryType) => {
  switch (type) {
    case ReqsCategoryType.Emergent:
      return "فوری";
    case ReqsCategoryType.Suggested:
      return "پیشنهادی";
    case ReqsCategoryType.Daily:
      return "روزمره";
  }
};

type Props = {
  type: ReqsCategoryType;
};

function RequestsCategory({ type }: Props) {
  const storageUser = showLocalStorage("user");
  const [itemsEmergancy, setItemsEmergancy] = useState<
    IPresentableRequest[] | []
  >([]);

  const [itemsNormal, setItemsNormal] = useState<IPresentableRequest[] | []>(
    []
  );
  const [itemsSuggest, setItemsSuggest] = useState<IPresentableRequest[] | []>(
    []
  );
  const history = useHistory();

  useEffect(() => {
    NormalRequest();
    EmergancyRequest();
  }, []);

  useEffect(() => {
    if (storageUser === undefined || storageUser === null) {
      return;
    } else {
      SuggestRequest(storageUser.Id);
    }
  }, []);

  const EmergancyRequest = async () => {
    const res = await service.GetEmergencyRequest();
    if (res.Error) {
      toast.error("مشکل در ارتباط با سرور");
      return;
    }
    const AllData = res.Data as IPresentableRequest[];
    setItemsEmergancy(AllData);
  };

  const NormalRequest = async () => {
    const res = await service.GetNormalRequest();
    if (res.Error) {
      toast.error("مشکل در ارتباط با سرور");
      return;
    }
    const AllData = res.Data as IPresentableRequest[];
    setItemsNormal(AllData);
  };

  const SuggestRequest = async (id: string) => {
    const res = await service.GetSuggestedRequest(id);
    const AllData = res.Data as IPresentableRequest[];
    setItemsSuggest(AllData);
  };

  const checkAcceptRequest = async (id: string, userId: string) => {
    if (storageUser != undefined) {
      if (storageUser !== "null") {
        if (storageUser.Id === userId) {
          toast.error("شما نمی توانید درخواست خود را پذیرش نمایید!");
          return;
        } else {
          const { Data: checkRequest } = await ServiceAccept.getCheckRegister(
            storageUser.Id,
            id
          );
          if (checkRequest === false) {
            toast.error("به دلیل لغو این درخواست،اجازه پذیرش مجدد ندارید.");
            return;
          } else {
            moveInsertRequest(id, userId);
            return;
          }
        }
      }
    }
    history.push("/Login");
  };

  const moveInsertRequest = async (id: string, userId: string) => {
    await ServiceAccept.viewUpdate(id);
    history.push(`/requestconfirm/R/${id}`);
  };


  const linkMaker = (type: ReqsCategoryType) => {
    switch (type) {
      case ReqsCategoryType.Emergent:
        return history.push("/RequestList/emergancy");
      case ReqsCategoryType.Suggested:
        return history.push("/RequestList/suggest");
      case ReqsCategoryType.Daily:
        return history.push("/RequestList");
    }
  };

  const AllData = (type: ReqsCategoryType) => {
    switch (type) {
      case ReqsCategoryType.Emergent:
        return itemsEmergancy;
      case ReqsCategoryType.Suggested:
        return itemsSuggest;
      case ReqsCategoryType.Daily:
        return itemsNormal;
    }
  };

  return (
    <div className="reqs-category-container">
      <ButtonBase
        onClick={() => {
          linkMaker(type);
        }}
        className={`reqs-category-title-${type}`}
      >
        <div className="reqs-category-fake-icon">
          <img src={iconIdentifier(type)} alt="" />
        </div>
        <p style={{ fontFamily: "IRANSansX", fontSize: "18px" }}>
          درخواست های {persianTitleMaker(type)}
        </p>
      </ButtonBase>
      <ReqsGrid
        items={AllData(type)}
        callBackAddRequest={(id: string, userId: string) => {
          checkAcceptRequest(id, userId);
        }}
      />
    </div>
  );
}

export default RequestsCategory;
