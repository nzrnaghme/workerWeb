import { useState, useEffect } from "react";
import "./index.scss";
import { IRegisterSave } from "../MyRequestList/Entities";
import * as service from "../MyRequestList/IService";
import MoreInformationDetailRequest from "./ReqGeneralInfo";
import LocationDetail from "./Location";
import TimeDetail from "./TimeDetail";
import { trackPromise } from "react-promise-tracker";

function DetailRequest({ match }: any) {
  const [detailRequest, setDetailRequest] = useState<IRegisterSave>();

  useEffect(() => {
    trackPromise(GetDetaile(match.params.id));
  }, [match]);

  const GetDetaile = async (id: string) => {
    const item = await service.getRequestRegisteration(id);

    setDetailRequest(item.Data as IRegisterSave);
  };

  return (
    <>
      {detailRequest != undefined && detailRequest != null && (
        <>
          <MoreInformationDetailRequest item={detailRequest} />
          <TimeDetail item={detailRequest} />
          <LocationDetail item={detailRequest} />
        </>
      )}
    </>
  );
}
export default DetailRequest;
