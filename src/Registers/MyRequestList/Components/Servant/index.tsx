import React, { useState, useEffect } from "react";
import { IServant, RequestServant } from "../../Entities";
import * as service from "../../IService";
import YootaabDataGrid from "../../../../Components/YootaabDataGrid";
import ServantPaper from "./ServantPaper";
import EmptyData from "../../../../Components/YootaabDataGrid/EmptyData";
import { trackPromise } from "react-promise-tracker";

function DetailRequestServant({ match }: any) {
  const [items, setItems] = useState<RequestServant[] | []>([]);
  const [skip, setSkip] = useState(0);
  const [showEmpty, setShowEmpty] = useState(false);
  const msg = "همیاری جهت نمایش وجود ندارد...";

  useEffect(() => {
    if (match.params.id != null && match.params.id != "") {
      filter.requestRegistrationId = match.params.id;
      let newFilter = { ...filter };
      trackPromise(GetDetaileServant(newFilter));
    }
  }, [match]);

  const [filter, setFilter] = useState<IServant>({
    skip: 0,
    take: 4,
    requestRegistrationId: match.param,
  });

  const GetDetaileServant = async (filter: IServant) => {
    setShowEmpty(false);
    setItems([]);
    const item = await service.getShowRequestConfirm(filter);
    const AllData = item.Data;
    if (AllData.length === 0) {
      setShowEmpty(true);
    }
    setItems(AllData);
    setFilter(filter);
    setSkip(0);
  };

  const getNextRequest = async () => {
    filter.skip = skip + 1;
    const res = await service.getShowRequestConfirm(filter);
    const AllData = res.Data;
    if (AllData.length > 0 && items != null && items.length > 0) {
      let c = items?.concat(AllData);
      setItems(c);
    }
    setSkip(filter.skip);
  };

  return (
    <>
      <YootaabDataGrid
        items={items}
        fetchMoreData={() => {
          getNextRequest();
        }}
      >
        <div className="reqs-filterless-grid-container">
          {items != null && items.map((c) => <ServantPaper item={c} />)}
        </div>
      </YootaabDataGrid>
      {showEmpty && <EmptyData text={msg} />}
    </>
  );
}
export default DetailRequestServant;
