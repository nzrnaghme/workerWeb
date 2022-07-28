import SimpleFilter from "../components/SimpleFilter";
import DateFilter from "../components/DateFilter";
import TabBtnsFilter from "../components/TabBtnsFilter";
import "../index.scss";
import * as service from "../../DailyRequestContainList/IService";
import { useEffect, useState } from "react";
import {
  IFilterRequestRequests,
  selectRequestStatus,
  IReqsDate,
  ICheckable,
} from "../Entites";
import moment from "moment";
import { showLocalStorage } from "../../../Routers/localStorage";
import { toEnglishNumber } from "../../../Components/hooks/persianHelper";

type Props = {
  onFilter: (filter: IFilterRequestRequests) => void;
  userId: string;
  lastFilter?: IFilterRequestRequests | null;
};

function Filters({ onFilter, userId, lastFilter }: Props) {
  const storageUser = showLocalStorage("user");
  const [categories, setCategories] = useState<ICheckable[]>([]);
  const [reqTypes, setReqTypes] = useState<ICheckable[]>([
    { name: "عادی", id: 0, isChecked: false },
    { name: "فوری", id: 1, isChecked: false },
  ]);
  const [implementationTypes, setImplementationTypes] = useState<ICheckable[]>([
    { name: "حضوری", id: 0, isChecked: false },
    { name: "غیرحضوری", id: 1, isChecked: false },
  ]);

  const [date, setDate] = useState<IReqsDate>();
  const [hasCategory, setHasCategory] = useState<boolean>(false);
  const [status, setStatus] = useState<ICheckable[]>(selectRequestStatus);
  const [tempRegion, setTempRegion] = useState(["", "", ""]);

  useEffect(() => {
    if (storageUser !== null) {
      CategoryFiller();
      const statusFalse = status.map((i) => {
        i.isChecked = false;
        return i;
      });
      setStatus(statusFalse);
    }
  }, []);

  useEffect(() => {
    if (lastFilter && categories.length > 0) {
      LastFilter(lastFilter);
    }
  }, [categories.length]);

  const LastFilter = (lastFilter: IFilterRequestRequests) => {
    let PresencTypeCheck = implementationTypes;
    let CategoryCheck = categories;
    let StatusUser = status;
    let RequestTypeCheck = reqTypes;
    let RegionCkeck = tempRegion;
    let DateCheck = date;

    if (lastFilter.beginDate) {
      const BeginDateLast = new Date(lastFilter.beginDate);
      if (lastFilter.endDate) {
        const EndDateLast = new Date(lastFilter.endDate);
        DateCheck = { start: BeginDateLast, end: EndDateLast };
        setDate(DateCheck);
      } else {
        DateCheck = { start: BeginDateLast, end: undefined };
        setDate(DateCheck);
      }
    }

    if (lastFilter.endDate) {
      const EndDateLast = new Date(lastFilter.endDate);
      if (lastFilter.beginDate) {
        const BeginDateLast = new Date(lastFilter.beginDate);
        DateCheck = { start: BeginDateLast, end: EndDateLast };
        setDate(DateCheck);
      } else {
        DateCheck = { start: undefined, end: EndDateLast };
        setDate(DateCheck);
      }
    }

    if (lastFilter.presenceType) {
      const presentType = lastFilter.presenceType;
      PresencTypeCheck = implementationTypes.map((i) => {
        presentType.map((n) => {
          if (n === i.id) {
            i.isChecked = true;
          }
        });
        return i;
      });
      setImplementationTypes(PresencTypeCheck);
    }
    if (lastFilter.requestCategoryId) {
      const categorySelectLast = lastFilter.requestCategoryId;
      CategoryCheck = categories.map((i) => {
        categorySelectLast.map((n) => {
          if (n === i.id) i.isChecked = true;
        });
        return i;
      });
      setCategories(CategoryCheck);
    }
    if (lastFilter.requestStatus) {
      const categoryUserSelectLast = lastFilter.requestStatus;
      StatusUser = selectRequestStatus.map((i) => {
        categoryUserSelectLast.map((n: number) => {
          if (n === i.id) i.isChecked = true;
        });
        return i;
      });
      setStatus(StatusUser);
    }
    if (lastFilter.requestType) {
      const requesttType = lastFilter.requestType;
      RequestTypeCheck = reqTypes.map((i) => {
        requesttType.map((n) => {
          if (n === i.id) {
            i.isChecked = true;
          }
        });
        return i;
      });
      setReqTypes(RequestTypeCheck);
    }
    if (lastFilter.regions) {
      const regionCurrentLast = lastFilter.regions;
      if (regionCurrentLast[0] === undefined || regionCurrentLast[0] === "") {
        RegionCkeck = ["", "", ""];
      } else if (
        regionCurrentLast[1] === undefined ||
        regionCurrentLast[1] === ""
      ) {
        RegionCkeck = [regionCurrentLast[0]];
      } else if (
        regionCurrentLast[2] === undefined ||
        regionCurrentLast[2] === ""
      ) {
        RegionCkeck = [regionCurrentLast[0], regionCurrentLast[1]];
      } else {
        RegionCkeck = [
          regionCurrentLast[0],
          regionCurrentLast[1],
          regionCurrentLast[2],
        ];
      }

      setTempRegion(RegionCkeck);
    }

    onFilterApplied(
      CategoryCheck,
      RequestTypeCheck,
      StatusUser,
      PresencTypeCheck,
      DateCheck,
      RegionCkeck
    );
  };

  const onRegionChanged = (
    stateId: string,
    cityId: string,
    regionId: string
  ) => {
    const AllTempRegions = [stateId, cityId, regionId];
    onFilterApplied(
      categories,
      reqTypes,
      status,
      implementationTypes,
      date,
      AllTempRegions
    );
    setTempRegion(AllTempRegions);
  };

  const CategoryFiller = async () => {
    const res = await service.getCategoryFiller();

    if (res.Data) {
      const categories = res.Data.map((c: any) => {
        return { name: c.name, id: c.id, isChecked: false };
      });
      setHasCategory(true);
      setCategories(categories);
    }
  };

  const idsListMaker = (list: ICheckable[]) => {
    let m = list.filter((i) => i.isChecked).map((i) => i.id);
    if (m.length === 0) {
      return null;
    }
    return m;
  };

  const idsListNumber = (list: ICheckable[]) => {
    let m = list.filter((i) => i.isChecked).map((i) => Number(i.id));
    if (m.length === 0) {
      return null;
    }
    return m;
  };

  const stringBegibDate = (allDate: IReqsDate | null) => {
    if (allDate?.start === undefined) {
      return null;
    }
    let dateBegin = moment(allDate?.start).format("YYYY/MM/DD");
    return toEnglishNumber(dateBegin);
  };

  const stringEndDate = (allDate: IReqsDate | null) => {
    if (allDate?.end === undefined) {
      return null;
    }
    let dateEnd = moment(allDate?.end).format("YYYY/MM/DD");
    return toEnglishNumber(dateEnd);
  };

  const Regions = (regions: string[]) => {
    if (regions[0] === undefined || regions[0] === "") {
      return null;
    }
    if (regions[1] === undefined || regions[1] === "") {
      return [regions[0]];
    }
    if (regions[2] === undefined || regions[2] === "") {
      return [regions[0], regions[1]];
    }
    return [regions[0], regions[1], regions[2]];
  };

  //I don't use Usestate because cause More refresh page and I forced use more work
  const onFilterApplied = (
    categories: ICheckable[],
    reqTypes: ICheckable[],
    status: ICheckable[],
    implementationTypes: ICheckable[],
    date: any,
    tempRegion: string[]
  ) => {
    const filter: IFilterRequestRequests = {
      skip: 0,
      take: 12,
      userId: userId,
      requestType: idsListNumber(reqTypes),
      regions: Regions(tempRegion),
      beginDate: stringBegibDate(date),
      endDate: stringEndDate(date),
      presenceType: idsListNumber(implementationTypes),
      requestCategoryId: idsListMaker(categories),
      requestStatus: idsListMaker(status),
    };

    onFilter(filter);
  };

  return (
    <>
      {hasCategory && (
        <div className="filters-container">
          <SimpleFilter
            title="وضعیت"
            list={status}
            onFilterChanged={(c: any) => {
              onFilterApplied(
                categories,
                reqTypes,
                c,
                implementationTypes,
                date,
                tempRegion
              );
              setStatus(c);
            }}
            searchable
          />
          <SimpleFilter
            title="دسته بندی ها"
            list={categories}
            onFilterChanged={(c: any) => {
              onFilterApplied(
                c,
                reqTypes,
                status,
                implementationTypes,
                date,
                tempRegion
              );
              setCategories(c);
            }}
            searchable
          />
          <SimpleFilter
            title="نوع درخواست"
            list={reqTypes}
            onFilterChanged={(c: any) => {
              onFilterApplied(
                categories,
                c,
                status,
                implementationTypes,
                date,
                tempRegion
              );
              setReqTypes(c);
            }}
          />
          <SimpleFilter
            title="نحوه انجام کار"
            list={implementationTypes}
            onFilterChanged={(c: any) => {
              onFilterApplied(
                categories,
                reqTypes,
                status,
                c,
                date,
                tempRegion
              );
              setImplementationTypes(c);
            }}
          />
          <DateFilter
            LastSelect={date}
            titleName="تاریخ ثبت درخواست"
            onDateFiltered={(c) => {
              onFilterApplied(
                categories,
                reqTypes,
                status,
                implementationTypes,
                c,
                tempRegion
              );
              setDate(c);
            }}
          />
          <TabBtnsFilter
            onFilterChanged={onRegionChanged}
            LastSelect={tempRegion}
          />
        </div>
      )}
    </>
  );
}

export default Filters;
