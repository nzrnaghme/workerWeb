import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@material-ui/core";
import { MyServantData } from "./Entities";
import * as service from "./IService";
import { ButtonBase } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import FiltersContainer from "../filters/MyServants";
import { showLocalStorage } from "../../Routers/localStorage";
import { IFilterServisecRequests } from "../filters/Entites";
import FullDialog from "../../Components/FullDialog";
import YootaabDataGrid from "../../Components/YootaabDataGrid";
import RequestPaper from "./Components/RequestPaper";
import { trackPromise } from "react-promise-tracker";
import EmptyData from "../../Components/YootaabDataGrid/EmptyData";

function MyServantList() {
  const storageUser = showLocalStorage("user");
  const [skip, setSkip] = useState(0);
  const [filter, setFilter] = useState<IFilterServisecRequests>({
    skip: 0,
    take: 12,
    userId: storageUser?.Id,
    requestType: null,
    regions: null,
    beginDate: null,
    endDate: null,
    presenceType: null,
    requestCategoryId: null,
    reportRequestStatus: null,
  });
  const FilterLast = useRef(filter);
  const [items, setItems] = useState<MyServantData[] | []>([]);
  const matchesMd = useMediaQuery("(max-width:60rem)");
  const [open, setOpen] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const msg = "خدمتی وجود ندارد...";

  //false === oldest

  useEffect(() => {
    if (
      storageUser != null &&
      storageUser?.Id != null &&
      storageUser?.Id != ""
    ) {
      if (matchesMd) trackPromise(search(filter));
      trackPromise(search(filter));
    }
  }, [matchesMd]);

  const search = async (filter: IFilterServisecRequests) => {
    setShowEmpty(false);
    setItems([]);
    const res = await service.postAllUserRequest(filter);
    const AllData = res.Data;
    if (AllData.length === 0) {
      setShowEmpty(true);
    }
    setItems(AllData);
    setShowFilter(true);
    setFilter(filter);
    setSkip(0);
  };

  const getNextRequest = async (filter: IFilterServisecRequests) => {
    filter.skip = skip + 1;
    const res = await service.postAllUserRequest(filter);
    const AllData = res.Data;
    if (AllData.length > 0 && items != null && items.length > 0) {
      let c = items?.concat(AllData);
      setItems(c);
    }
    setSkip(filter.skip);
  };

  const FilterDialog = (filter: IFilterServisecRequests) => {
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
            height: "2.5rem",
            width: "2.5rem",
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
              onFilter={(filterFromForm: IFilterServisecRequests) => {
                if (JSON.stringify(filterFromForm) !== JSON.stringify(filter)) {
                  trackPromise(search(filterFromForm));
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
          {items != null && items.map((c) => <RequestPaper item={c} />)}
        </div>
      </YootaabDataGrid>

      {showEmpty && <EmptyData text={msg} />}
    </div>
  );
}

export default MyServantList;
