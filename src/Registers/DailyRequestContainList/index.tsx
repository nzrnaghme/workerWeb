import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@material-ui/core";
import Paper from "../../Components/Paper/";
import { IPresentableRequest } from "./Entities";
import { SortList } from "../../Models/Enums";
import * as service from "./IService";
import { toast } from "react-toastify";
import DropDown from "../../Components/Inputs/DropDown";
import { selectOptions } from "./Entities";
import "./index.scss";
import { IResult } from "../../Services/Entities";
import { useHistory } from "react-router-dom";
import FiltersContainer from "../filters/DailyRequests/index";
import Popup from "../../Components/Modals/Popup";
import { ICheckable, IFilterDaily } from "../filters/Entites";
import { showLocalStorage } from "../../Routers/localStorage";
import { ButtonBase } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSortAmountUp } from "@fortawesome/free-solid-svg-icons";
import MenuItem from "@material-ui/core/MenuItem";
import FullDialog from "../../Components/FullDialog";
import RequestPaper from "../../Components/DailyRequestPaper";
import YootaabDataGrid from "../../Components/YootaabDataGrid";
import { trackPromise } from "react-promise-tracker";
import EmptyData from "../../Components/YootaabDataGrid/EmptyData";

function DailyRequest() {
  const matchesMd = useMediaQuery("(max-width:60rem)");
  const storageUser = showLocalStorage("user");

  const [filter, setFilter] = useState<IFilterDaily>({
    skip: 0,
    take: 12,
    dailyRequestSorts: SortList.AscendingByDate,
    requestType: null,
    title: null,
    regions: null,
    beginDate: null,
    endDate: null,
    presenceType: null,
    requestCategoryId: null,
    requestUserCategoryId: null,
  });
  const [items, setItems] = useState<IPresentableRequest[] | []>([]);

  const [selectSort, setSelectSort] = useState<SortList>(
    SortList.DescendingByDate
  );
  const [openFilter, setOpenFilter] = useState(false);
  const [openSort, setOpenSort] = useState(false);
  const [fillMyCategory, setFillMyCategory] = useState(false);
  const [skip, setSkip] = useState(0);
  const history = useHistory();
  const [isSuggestion, setIsSuggestion] = useState<string>("");
  const FilterLast = useRef(filter);

  const [showEmpty, setShowEmpty] = useState(false);
  const ShowFilter = useRef(false);

  const mySkills = useRef<ICheckable[]>([]);
  const msg = "درخواستی وجود ندارد...";

  useEffect(() => {
    if (storageUser.Id != null && storageUser.Id != "" && storageUser != null) {
      CategoryIdFiller(storageUser.Id);
    }
  }, []);

  useEffect(() => {
    if (!fillMyCategory) return;
    if (history.location.pathname === "/RequestList/emergancy") {
      if (matchesMd) {
        filter.regions = null;
        filter.requestType = [1];
        filter.presenceType = null;
        filter.requestUserCategoryId = null;
        filter.beginDate = null;
        filter.endDate = null;
        filter.requestCategoryId = null;
        filter.skip = 0;
        filter.title = null;
        trackPromise(search(filter));
        setIsSuggestion("emergancy");
        return;
      } else {
        filter.regions = null;
        filter.requestType = [1];
        filter.presenceType = null;
        filter.requestUserCategoryId = null;
        filter.beginDate = null;
        filter.endDate = null;
        filter.requestCategoryId = null;
        filter.skip = 0;
        filter.title = null;
        setIsSuggestion("emergancy");
      }
    } else if (history.location.pathname === "/RequestList/suggest") {
      if (mySkills.current.length > 0) {
        if (matchesMd) {
          const checkedSkills = mySkills.current.map((i) => {
            i.isChecked = true;
            return i.id;
          });
          filter.regions = null;
          filter.requestType = null;
          filter.presenceType = null;
          filter.beginDate = null;
          filter.endDate = null;
          filter.requestCategoryId = null;
          filter.skip = 0;
          filter.title = null;
          filter.requestUserCategoryId = checkedSkills;
          trackPromise(search(filter));
          setIsSuggestion("suggest");
          return;
        } else {
          const checkedSkills = mySkills.current.map((i) => {
            i.isChecked = true;
            return i.id;
          });
          filter.skip = 0;
          filter.requestType = null;
          filter.regions = null;
          filter.presenceType = null;
          filter.beginDate = null;
          filter.title = null;
          filter.endDate = null;
          filter.requestCategoryId = null;
          filter.requestUserCategoryId = checkedSkills;
          setIsSuggestion("suggest");
          return;
        }
      } else setIsSuggestion("suggest");
    } else if (history.location.pathname === "/RequestList") {
      if (matchesMd) {
        filter.skip = 0;
        filter.regions = null;
        filter.requestType = [0];
        filter.endDate = null;
        filter.presenceType = null;
        filter.beginDate = null;
        filter.requestCategoryId = null;
        filter.title = null;
        filter.requestUserCategoryId = null;
        trackPromise(search(filter));
        setIsSuggestion("daily");
        return;
      } else {
        filter.skip = 0;
        filter.regions = null;
        filter.requestType = [0];
        filter.endDate = null;
        filter.presenceType = null;
        filter.beginDate = null;
        filter.title = null;
        filter.requestCategoryId = null;
        filter.requestUserCategoryId = null;
        setIsSuggestion("daily");
      }
    }
  }, [history.location.pathname, fillMyCategory]);

  useEffect(() => {
    if (isSuggestion === "") return;
    switch (selectSort) {
      case 0:
        if (isSuggestion === "suggest") {
          const checkedSkills = mySkills.current.map((i) => {
            return i.id;
          });
          filter.dailyRequestSorts = 0;
          filter.skip = 0;
          filter.requestUserCategoryId =
            mySkills.current.length > 0 ? checkedSkills : null;
        } else if (isSuggestion === "emergancy") {
          filter.skip = 0;
          filter.dailyRequestSorts = 0;
          filter.requestType = [1];
        } else if (isSuggestion === "daily") {
          filter.skip = 0;
          filter.dailyRequestSorts = 0;
        }
        break;
      case 1:
        if (isSuggestion === "suggest") {
          const checkedSkills = mySkills.current.map((i) => {
            return i.id;
          });
          filter.dailyRequestSorts = 1;
          filter.skip = 0;
          filter.requestUserCategoryId =
            mySkills.current.length > 0 ? checkedSkills : null;
        } else if (isSuggestion === "emergancy") {
          filter.dailyRequestSorts = 1;
          filter.skip = 0;
          filter.requestType = [1];
        } else if (isSuggestion === "daily") {
          filter.skip = 0;
          filter.dailyRequestSorts = 1;
        }
        break;
      case 2:
        if (isSuggestion === "suggest") {
          const checkedSkills = mySkills.current.map((i) => {
            return i.id;
          });
          filter.dailyRequestSorts = 2;
          filter.skip = 0;
          filter.requestUserCategoryId =
            mySkills.current.length > 0 ? checkedSkills : null;
        } else if (isSuggestion === "emergancy") {
          filter.skip = 0;
          filter.dailyRequestSorts = 2;
          filter.requestType = [1];
        } else if (isSuggestion === "daily") {
          filter.skip = 0;
          filter.dailyRequestSorts = 2;
        }
        break;
      case 3:
        if (isSuggestion === "suggest") {
          const checkedSkills = mySkills.current.map((i) => {
            return i.id;
          });
          filter.dailyRequestSorts = 3;
          filter.skip = 0;
          filter.requestUserCategoryId =
            mySkills.current.length > 0 ? checkedSkills : null;
        } else {
          filter.dailyRequestSorts = 3;
          filter.requestUserCategoryId = null;
        }
        if (isSuggestion === "emergancy") {
          filter.skip = 0;
          filter.requestType = [1];
        } else if (isSuggestion === "daily") {
          filter.skip = 0;
          filter.dailyRequestSorts = 3;
        }
        break;
    }
    trackPromise(search(filter));
  }, [isSuggestion, selectSort]);

  const CategoryIdFiller = async (id: string) => {
    const res = await service.getCategoryIdByUser(id);
    setFillMyCategory(true);
    if (res.Data)
      mySkills.current = res.Data.map((c: any) => {
        return { name: c.name, id: c.id, isChecked: false };
      });
  };

  const search = async (filter: IFilterDaily) => {
    setItems([]);
    setShowEmpty(false);
    if (
      history.location.pathname === "/RequestList/suggest" &&
      (filter.requestUserCategoryId === null || mySkills.current.length === 0)
    ) {
      ShowFilter.current = true;
      setShowEmpty(true);
      return;
    }
    const res: IResult = await service.postRequestFilter(filter);
    if (res.Error) {
      toast.error("مشکل در ارتباط با سرور");
      return;
    }
    const AllData = res.Data as IPresentableRequest[];
    ShowFilter.current = true;
    if (AllData.length === 0) {
      setShowEmpty(true);
    }
    setItems(AllData);
    setFilter(filter);
    setSkip(0);
  };

  const getNextRequest = async (filter: IFilterDaily) => {
    filter.skip = skip + 1;
    const res: IResult = await service.postRequestFilter(filter);
    const AllData = res.Data;
    let c = items?.concat(AllData);
    setItems(c);
    setSkip(filter.skip);
    setFilter(filter);
  };

  const sortForMobile = (id: SortList) => {
    let sortBy = selectSort;
    switch (id) {
      case SortList.DescendingByDate:
        sortBy = SortList.DescendingByDate;
        break;
      case SortList.AscendingByDate:
        sortBy = SortList.AscendingByDate;
        break;
      case SortList.DescendingByScore:
        sortBy = SortList.DescendingByScore;
        break;
      case SortList.AscendingByScore:
        sortBy = SortList.AscendingByScore;
        break;
    }
    setSelectSort(sortBy);
    setOpenSort(false);
  };

  const sort = !matchesMd ? (
    <DropDown
      label="مرتب سازی"
      options={selectOptions}
      onSelectedChanged={(s) => {
        setSelectSort(s);
        if (matchesMd) {
          setOpenSort(false);
        }
      }}
      selectedId={selectSort}
    />
  ) : (
    selectOptions.map((option: any) => (
      <MenuItem
        value={option.id}
        key={option.name}
        className={`${selectSort === option.id && "sort-mobile-item-active"}`}
        onClick={() => sortForMobile(option.id)}
      >
        <img src={option.icon} alt="" className="sort-icon" />
        {option.name}
      </MenuItem>
    ))
  );

  const checkAcceptRequest = async (id: string, userId: string) => {
    if (storageUser != undefined) {
      if (storageUser !== "null") {
        if (storageUser.Id === userId) {
          toast.error("شما نمی توانید درخواست خود را پذیرش نمایید!");
          return;
        } else {
          const { Data: checkRequest } = await service.getCheckRegister(
            storageUser.Id,
            id
          );
          if (checkRequest === false) {
            toast.error("به دلیل لغو این درخواست،اجازه پذیرش مجدد را ندارید.");
            return;
          } else {
            moveInsertRequest(id);
            return;
          }
        }
      }
    }

    history.push("/Login");
  };

  const moveInsertRequest = async (id: string) => {
    await service.viewUpdate(id);
    history.push(`/requestconfirm/R/${id}`);
  };

  const FilterDialog = (filter: IFilterDaily) => {
    FilterLast.current = filter;
  };

  return (
    <div className="filters-and-reqs-grid-wrapper">
      <FullDialog
        label="فیلترها"
        open={openFilter}
        onConfirm={() => {
          setOpenFilter(false);
          trackPromise(search(FilterLast.current));
        }}
        onCancel={() => {
          trackPromise(search(filter));
          setOpenFilter(false);
        }}
      >
        {fillMyCategory && (
          <FiltersContainer
            onFilter={FilterDialog}
            sortData={selectSort}
            isSuggest={isSuggestion}
            selectmySkills={mySkills.current}
            lastFilter={filter}
          />
        )}
      </FullDialog>

      {ShowFilter.current && (
        <Popup
          open={openSort}
          onCloseHandler={() => setOpenSort(false)}
          className="sort-filter-popup-mobile"
        >
          {sort}
        </Popup>
      )}

      {matchesMd ? (
        <div style={{ display: "flex" }}>
          <ButtonBase
            style={{
              height: "2.5rem",
              width: "2.5rem",
              borderRadius: "50%",
              marginBottom: "0.25rem",
            }}
            onClick={() => {
              setOpenFilter((p) => !p);
            }}
          >
            <FontAwesomeIcon
              style={{ fontSize: "1.2rem", color: "#00707e" }}
              icon={faFilter}
            />
          </ButtonBase>
          <ButtonBase
            style={{
              height: "2.5rem",
              width: "2.5rem",
              borderRadius: "50%",
              marginBottom: "0.25rem",
            }}
            onClick={() => {
              setOpenSort((p) => !p);
            }}
          >
            <FontAwesomeIcon
              style={{ fontSize: "1.2rem", color: "#00707e" }}
              icon={faSortAmountUp}
            />
          </ButtonBase>
        </div>
      ) : (
        ShowFilter.current && (
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <Paper className="fake-sort">{sort}</Paper>
            {fillMyCategory && (
              <FiltersContainer
                onFilter={(filterNew: IFilterDaily) => {
                  if (JSON.stringify(filterNew) !== JSON.stringify(filter)) {
                    trackPromise(search(filterNew));
                  }
                }}
                sortData={selectSort}
                isSuggest={isSuggestion}
                selectmySkills={mySkills.current}
              />
            )}
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
          {items.map((i, index) => (
            <div key={index}>
              <RequestPaper
                item={i}
                callBackAddRequest={() => {
                  checkAcceptRequest(i.id, i.userId);
                }}
              />
            </div>
          ))}
        </div>
      </YootaabDataGrid>
      {showEmpty && <EmptyData text={msg} />}
    </div>
  );
}

export default DailyRequest;
