import React, { useEffect, useState } from "react";
import * as service from "./IService";
import { CurrentList, IFilter } from "./Entites";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { RequestStepServant } from "../../Models/Enums";
import { showLocalStorage } from "../../Routers/localStorage";
import YootaabDataGrid from "../../Components/YootaabDataGrid";
import RequestPaper from "./Components/RequestPaper";
import { trackPromise } from "react-promise-tracker";
import EmptyData from "../../Components/YootaabDataGrid/EmptyData";

function MyCurrentRequestList() {
  const storageUser = showLocalStorage("user");
  const history = useHistory();
  const [skip, setSkip] = useState(0);
  const [filter, setFilter] = useState<IFilter>({
    skip: 0,
    take: 12,
    userId: storageUser.Id,
  });
  const [items, setItems] = useState<CurrentList[] | []>([]);
  const [showEmpty, setShowEmpty] = useState(false);
  const msg = "درخواست فعالی وجود ندارد.";

  useEffect(() => {
    if (storageUser !== null && storageUser.Id !== "") {
      trackPromise(Search(filter));
    }
  }, []);

  const Search = async (filter: IFilter) => {
    setShowEmpty(false);
    setItems([]);
    const res = await service.postCurrentRequestList(filter);
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
    const res = await service.postCurrentRequestList(filter);
    const AllData = res.Data;
    if (AllData.length > 0 && items != null && items.length > 0) {
      let c = items?.concat(AllData);
      setItems(c);
    }

    setSkip(filter.skip);
  };

  const callBackWhereRequest = async (
    stepId: string,
    requestStep: RequestStepServant,
    requestConfirmId: string
  ) => {
    if (storageUser != null) {
      switch (requestStep) {
        case 0:
          toast.warning("درخواست فعالی وجود ندارد");
          break;
        case 1:
          //form insert
          history.push(`/requestconfirm/C/${stepId}`);
          break;
        case 2:
          //waiting to arrived
          history.push(`/WaitingToArrived/${requestConfirmId}`);
          break;
        case 3:
          history.push(`/requestworking/${requestConfirmId}`);
          break;
        case 4:
          history.push(`/Survey/${requestConfirmId}`);
          break;
        default:
          break;
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
            items.map((c) => (
              <RequestPaper
                item={c}
                key={c.requestRegistrationId}
                callBackWhereRequest={() => {
                  callBackWhereRequest(
                    c.stepId,
                    c.requestStep,
                    c.requestConfirmId
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

export default MyCurrentRequestList;
