import React, { useEffect, useState } from "react";
import * as service from "./IService";
import { CurrentList, IFilter } from "./Entites";
import { RequestStepServant } from "../../Models/Enums";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { showLocalStorage } from "../../Routers/localStorage";
import YootaabDataGrid from "../../Components/YootaabDataGrid";
import RequestPaper from "./Components/RequestPaper";
import { trackPromise } from "react-promise-tracker";
import EmptyData from "../../Components/YootaabDataGrid/EmptyData";

function MyCurrentServantRequest() {
  const history = useHistory();
  const storageUser = showLocalStorage("user");
  const [skip, setSkip] = useState(0);
  const [filter, setFilter] = useState<IFilter>({
    skip: 0,
    take: 12,
    servantUserId: storageUser?.Id,
  });
  const [showEmpty, setShowEmpty] = useState(false);
  const [items, setItems] = useState<CurrentList[] | []>([]);
  const msg = "خدمت های فعالی وجود ندارد.";

  useEffect(() => {
    if (storageUser != null && storageUser.Id != "" && storageUser.Id != null) {
      trackPromise(Search(filter));
    }
  }, []);

  const Search = async (filter: IFilter) => {
    setShowEmpty(false);
    setItems([]);
    const res = await service.postCurrentServantList(filter);
    const AllData = res.Data;
    if (AllData.length === 0) {
      setShowEmpty(true);
    }
    setItems(AllData);
    setFilter(filter);
    setSkip(0);
  };

  const getNextRequest = async () => {
    filter.skip = skip + 1;
    const res = await service.postCurrentServantList(filter);
    const AllData = res.Data;
    if (AllData.length > 0 && items != null && items.length > 0) {
      let c = items?.concat(AllData);
      setItems(c);
    }
    setSkip(filter.skip);
  };

  const callBackWhereRequest = async (
    requestConfirmId: string,
    RequestStepServant: RequestStepServant,
    RequestStepServantId: string
  ) => {
    if (storageUser != null) {
      try {
        switch (RequestStepServant) {
          case 0:
            toast.warning("خدمت فعالی وجود ندارد.");
            break;
          case 1:
            //form insert
            history.push(`/requestconfirm/C/${RequestStepServantId}`);
            break;
          case 2:
            //waiting to arrived
            history.push(`/WaitingToArrived/${requestConfirmId}`);
            break;
          case 3:
            //start working
            history.push(`/requestworking/${requestConfirmId}`);
            break;
          case 4:
            history.push(`/Survey/${requestConfirmId}`);
            break;
          default:
            break;
        }
      } catch (e: any) {
        toast.error("مشکل سرور");
      }
    }
  };

  return (
    <>
      <YootaabDataGrid
        items={items}
        fetchMoreData={() => {
          trackPromise(getNextRequest());
        }}
      >
        <div className="reqs-filterless-grid-container">
          {items != null &&
            items.map((i) => (
              <RequestPaper
                key={i.requestRegistrationId}
                item={i}
                callBackWhereRequest={() => {
                  callBackWhereRequest(
                    i.requestConfirmId,
                    i.requestStep,
                    i.stepId
                  );
                }}
              />
            ))}
        </div>
      </YootaabDataGrid>
      {showEmpty && <EmptyData text={msg} />}
    </>
  );
}

export default MyCurrentServantRequest;
