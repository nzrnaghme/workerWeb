import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@material-ui/core";
import { MyRequestData } from "./Entities";
import * as service from "./IService";
import useSignalR from "../../Components/hooks/useSignalR";
import { RequestReportApi } from "../../config";
import { toast } from "react-toastify";
import FiltersContainer from "../filters/MyRequests";
import { ButtonBase } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { toPersianNumber } from "../../Components/hooks/persianHelper";
import { showLocalStorage } from "../../Routers/localStorage";
import { useGeneralContext } from "../../Providers/GeneralContext";
import { IFilterRequestRequests } from "../filters/Entites";
import FullDialog from "../../Components/FullDialog";
import YootaabDataGrid from "../../Components/YootaabDataGrid";
import RequestPaper from "./Components/RequestPaper";
import { trackPromise } from "react-promise-tracker";
import EmptyData from "../../Components/YootaabDataGrid/EmptyData";

const removeRequestHandler = "آیا مطمئن هستید میخواهید لغو کنید؟";
const removeWithNRequest = (countOfRequest: number) =>
  `تعداد ${countOfRequest} نفر درحال بررسی درخواست شما هستند، آیا لغو میکنید؟`;
const informationCancellationRequest = (
  nameOfRequestCancel: string,
  familyOfRequestCancel: string
) =>
  `${nameOfRequestCancel} ${" "}${familyOfRequestCancel} درخواست را لغو نموده.`;

const editeRequest = (countOfRequest: number) =>
  `با توجه به اینکه درخواست شما در حال بررسی ${toPersianNumber(
    countOfRequest
  )} نفر است،امکان ویرایش را ندارید.`;

function MyRequestList() {
  const history = useHistory();
  const matchesMd = useMediaQuery("(max-width:60rem)");
  const [open, setOpen] = useState(false);
  const storageUser = showLocalStorage("user");
  const connectionInstanceMaker = useSignalR();
  const { onConfirmSetter, setConfirmPopupOpen } = useGeneralContext();
  const [connection, setConnection] = useState<signalR.HubConnection>();
  const [isConnected, setIsConnected] = useState(false);
  const [items, setItems] = useState<MyRequestData[] | []>([]);

  const [skip, setSkip] = useState(0);
  const [numberOfServant, setNumberOfServant] = useState<number>(0);
  const [filter, setFilter] = useState<IFilterRequestRequests>({
    skip: 0,
    take: 12,
    userId: storageUser?.Id,
    requestType: null,
    regions: null,
    beginDate: null,
    endDate: null,
    presenceType: null,
    requestCategoryId: null,
    requestStatus: null,
  });
  const FilterLast = useRef(filter);
  const [showEmpty, setShowEmpty] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const msg = "درخواستی وجود ندارد...";



  useEffect(() => {
    onConnectionInstanceResolved();
  }, []);

  useEffect(() => {
    if (storageUser) {
      //&& itemOfId
      connection?.on("ReceiveMessage", (requestRegistrationId: string) => {
        if (requestRegistrationId === storageUser.Id) return;
        toast.warning(
          informationCancellationRequest(
            storageUser.FirstName,
            storageUser.LastName
          )
        );
      });
    }
  }, [connection]);

  useEffect(() => {
    if (
      storageUser?.Id != null &&
      storageUser?.Id != "" &&
      storageUser != null
    ) {
      if (matchesMd) trackPromise(search(filter));
      trackPromise(search(filter));
    }
  }, [matchesMd]);

  const removeRequestOkHandler = async (id: string) => {
    if (storageUser && id) {
      const numberOf = await service.getCancelRequestReqisterBeforConfirm(
        id,
        storageUser.Id
      );
      if (numberOfServant > 0) {
        connection?.invoke("CancelRequest", id).catch((e) => console.log(e));
      }
      filter.skip = 0;
      trackPromise(search(filter));
    }
  };

  const onConnectionInstanceResolved = async () => {
    if (connection == null || connection == undefined) {
      const instance = await connectionInstanceMaker(
        storageUser.accessToken,
        setIsConnected,
        RequestReportApi + "RequestReportHub"
      );
      setConnection(instance);
    }
  };

  const checkingCancellation = async (id: string) => {
    const res = await service.getCountAcceptRequestConfirm(id);
    setNumberOfServant(res.Data);
    if (res.Data === 0) {
      onConfirmSetter(removeRequestHandler, () => {
        trackPromise(removeRequestOkHandler(id));
      });
      setConfirmPopupOpen(true);
    } else if (res.Data > 0) {
      onConfirmSetter(removeWithNRequest(res.Data), () => {
        trackPromise(removeRequestOkHandler(id));
      });
      setConfirmPopupOpen(true);
    }
  };

  const EditedFormMyRequest = async (requestRegistrationId: string) => {
    const res = await service.getCountAcceptRequestConfirm(
      requestRegistrationId
    );
    if (res.Data === 0) {
      history.push("/EditRequest/" + requestRegistrationId);
    } else if (res.Data > 0) {
      toast.error(editeRequest(res.Data));
    }
  };

  const search = async (filter: IFilterRequestRequests) => {
    setShowEmpty(false);
    setItems([]);
    setFilter(filter);
    const res = await service.postAllUserRequest(filter);
    if (res.Error) {
      toast.error("مشکل در ارتباط با سرور");
      return;
    }
    const AllData = res.Data;
    if (AllData.length === 0) {
      setShowEmpty(true);
    }
    setItems(AllData);
    setSkip(0);
    setShowFilter(true);
  };

  const getNextRequest = async (filter: IFilterRequestRequests) => {
    filter.skip = skip + 1;
    const res = await service.postAllUserRequest(filter);
    const AllData = res.Data;
    if (AllData.length > 0 && items != null && items.length > 0) {
      let c = items?.concat(AllData);
      setItems(c);
    }

    setSkip(filter.skip);
  };

  const FilterDialog = (filter: IFilterRequestRequests) => {
    FilterLast.current = filter;
  };

  return (
    <div className="filters-and-reqs-grid-wrapper">
      <FullDialog
        label="فیلترها"
        open={open}
        onConfirm={() => {
          setOpen(false);
          trackPromise(search(FilterLast.current));
        }}
        onCancel={() => {
          trackPromise(search(filter));
          setOpen(false);
        }}
      >
        <FiltersContainer
          onFilter={FilterDialog}
          userId={storageUser.Id}
          lastFilter={filter}
        />
      </FullDialog>

      {matchesMd ? (
        <ButtonBase
          style={{
            height: "2rem",
            width: "2rem",
            borderRadius: "0.25rem",
          }}
          onClick={() => {
            setOpen((p) => !p);
          }}
        >
          <FontAwesomeIcon
            style={{ fontSize: "1.2rem", color: "#00707e" }}
            icon={faFilter}
          />
        </ButtonBase>
      ) : (
        showFilter && (
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <FiltersContainer
              onFilter={(filterNew: IFilterRequestRequests) => {
                if (JSON.stringify(filterNew) !== JSON.stringify(filter)) {
                  trackPromise(search(filterNew));
                }
              }}
              userId={storageUser.Id}
            />
          </div>
        )
      )}
      <YootaabDataGrid
        items={items}
        fetchMoreData={() => {
          getNextRequest(filter);
        }}
      >
        <div className="reqs-grid-container">
          {items != null &&
            items.map((c) => (
              <RequestPaper
                item={c}
                callBackRemoveRequest={() => {
                  checkingCancellation(c.id);
                }}
                EditedFormMyRequest={() => {
                  trackPromise(EditedFormMyRequest(c.id));
                }}
              />
            ))}
        </div>
      </YootaabDataGrid>
      {showEmpty && <EmptyData text={msg} />}
    </div>
  );
}

export default MyRequestList;
