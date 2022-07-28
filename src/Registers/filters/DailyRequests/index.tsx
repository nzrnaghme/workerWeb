import SimpleFilter from "../components/SimpleFilter";
import DateFilter from "../components/DateFilter";
import TabBtnsFilter from "../components/TabBtnsFilter";
import "../index.scss";
import * as service from "../../DailyRequestContainList/IService";
import { useEffect, useState } from "react";
import { IFilterDaily, ICheckable, IReqsDate } from "../Entites";
import { IResult } from "../../../Services/Entities";
import moment from "moment";
import { showLocalStorage } from "../../../Routers/localStorage";
import { toEnglishNumber } from "../../../Components/hooks/persianHelper";
import Paper from "../../../Components/Paper/index";
import { useMediaQuery } from "@material-ui/core";
import Serach from "../../../Components/FiltersSearch";

type Props = {
  onFilter: (filter: IFilterDaily) => void;
  sortData: any;
  isSuggest: string;
  selectmySkills: ICheckable[] | [];
  lastFilter?: IFilterDaily | null;
};

function Filters({
  onFilter,
  sortData,
  isSuggest,
  selectmySkills,
  lastFilter,
}: Props) {
  const matchesMd = useMediaQuery("(max-width:60rem)");
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
  const [title, setTitle] = useState<string | undefined>("");

  const [date, setDate] = useState<IReqsDate>();
  const [hasCategory, setHasCategory] = useState<boolean>(false);
  const [mySkills, setMySkills] = useState<ICheckable[]>(selectmySkills);
  const [tempRegion, setTempRegion] = useState(["", "", ""]);

  useEffect(() => {
    if (storageUser != null) {
      CategoryFiller();
    }
  }, []);

  useEffect(() => {
    if (mySkills === null || mySkills.length === 0) return;
    if (isSuggest === "suggest" && mySkills.length > 0 && lastFilter) {
      const presenceTypeCheck = implementationTypes.map((i) => {
        i.isChecked = false;
        return i;
      });
      setImplementationTypes(presenceTypeCheck);
      const checkedSkills = mySkills.map((i) => {
        i.isChecked = false;
        return i;
      });
      setMySkills(checkedSkills);
      LastFilter(lastFilter);
    } else {
      return;
    }
  }, [mySkills.length, isSuggest]);

  useEffect(() => {
    if (isSuggest === "suggest") {
      if (mySkills.length === 0) {
        if (lastFilter) {
          const presenceTypeCheck = implementationTypes.map((i) => {
            i.isChecked = false;
            return i;
          });
          setImplementationTypes(presenceTypeCheck);
          LastFilter(lastFilter);
        } else {
          const checkType = reqTypes.map((i) => {
            i.isChecked = false;
            return i;
          });
          const checkedPresence = implementationTypes.map((i) => {
            i.isChecked = false;
            return i;
          });
          const checkCategories = categories.map((i) => {
            i.isChecked = false;
            return i;
          });
          const RegionAll = ["", "", ""];
          const titleNull = undefined;
          onFilterApplied(
            checkCategories,
            checkType,
            mySkills,
            checkedPresence,
            date,
            sortData,
            RegionAll,
            titleNull
          );
          setTitle(titleNull);
          setCategories(checkCategories);
          setImplementationTypes(checkedPresence);
          setTempRegion(["", "", ""]);
          setReqTypes(checkType);
          return;
        }
      } else if (lastFilter) {
        const presenceTypeCheck = implementationTypes.map((i) => {
          i.isChecked = false;
          return i;
        });
        setImplementationTypes(presenceTypeCheck);
        LastFilter(lastFilter);
      } else {
        const checkedPresence = implementationTypes.map((i) => {
          i.isChecked = false;
          return i;
        });
        const checkType = reqTypes.map((i) => {
          i.isChecked = false;
          return i;
        });
        const checkedSkills = mySkills.map((i) => {
          i.isChecked = true;
          return i;
        });
        const checkCategories = categories.map((i) => {
          i.isChecked = false;
          return i;
        });
        const RegionAll = ["", "", ""];
        const titleNull = undefined;
        onFilterApplied(
          checkCategories,
          checkType,
          checkedSkills,
          checkedPresence,
          date,
          sortData,
          RegionAll,
          titleNull
        );
        setTitle(titleNull);
        setCategories(checkCategories);
        setImplementationTypes(checkedPresence);
        setTempRegion(["", "", ""]);
        setMySkills(checkedSkills);
        setReqTypes(checkType);
      }
    } else if (isSuggest === "emergancy") {
      if (lastFilter) {
        const checkedSkills = mySkills.map((i) => {
          i.isChecked = false;
          return i;
        });
        setMySkills(checkedSkills);
        LastFilter(lastFilter);
      } else {
        const checkedSkills = mySkills.map((i) => {
          i.isChecked = false;
          return i;
        });
        const checkType = reqTypes.map((i) => {
          i.isChecked = false;
          if (i.id === 1) {
            i.isChecked = true;
          }
          return i;
        });
        const checkedPresence = implementationTypes.map((i) => {
          i.isChecked = false;
          return i;
        });
        const checkCategories = categories.map((i) => {
          i.isChecked = false;
          return i;
        });
        const titleNull = undefined;
        const RegionAll = ["", "", ""];
        onFilterApplied(
          checkCategories,
          checkType,
          checkedSkills,
          checkedPresence,
          date,
          sortData,
          RegionAll,
          titleNull
        );
        setTitle(titleNull);
        setCategories(checkCategories);
        setImplementationTypes(checkedPresence);
        setTempRegion(["", "", ""]);
        setMySkills(checkedSkills);
        setReqTypes(checkType);
      }
    } else if (isSuggest === "daily") {
      if (lastFilter) {
        const checkedSkills = mySkills.map((i) => {
          i.isChecked = false;
          return i;
        });
        setMySkills(checkedSkills);
        LastFilter(lastFilter);
      } else {
        const RegionAll = ["", "", ""];
        const checkedPresence = implementationTypes.map((i) => {
          i.isChecked = false;
          return i;
        });
        const checkedSkills = mySkills.map((i) => {
          i.isChecked = false;
          return i;
        });
        const checkType = reqTypes.map((i) => {
          i.isChecked = false;
          if (i.id === 0) {
            i.isChecked = true;
          }
          return i;
        });
        const checkCategories = categories.map((i) => {
          i.isChecked = false;
          return i;
        });
        const titleNull = undefined;

        onFilterApplied(
          checkCategories,
          checkType,
          checkedSkills,
          checkedPresence,
          date,
          sortData,
          RegionAll,
          titleNull
        );
        setTempRegion(["", "", ""]);
        setCategories(checkCategories);
        setImplementationTypes(checkedPresence);
        setMySkills(checkedSkills);
        setReqTypes(checkType);
        setTitle(titleNull);
      }
    }
  }, [isSuggest, categories.length > 0]);

  const LastFilter = (lastFilter: IFilterDaily) => {
    let PresencTypeCheck = implementationTypes;
    let CategoryCheck = categories;
    let CategoryUserCheck = mySkills;
    let RequestTypeCheck = reqTypes;
    let RegionCkeck = tempRegion;
    let DateCheck = date;
    let TitleCheck = title;

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
    if (lastFilter.requestUserCategoryId) {
      const categoryUserSelectLast = lastFilter.requestUserCategoryId;
      CategoryUserCheck = mySkills.map((i) => {
        categoryUserSelectLast.map((n) => {
          if (n === i.id) i.isChecked = true;
        });
        return i;
      });
      setMySkills(CategoryUserCheck);
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
    if (lastFilter.title) {
      TitleCheck = lastFilter.title;
      setTitle(lastFilter.title);
    }

    onFilterApplied(
      CategoryCheck,
      RequestTypeCheck,
      CategoryUserCheck,
      PresencTypeCheck,
      DateCheck,
      sortData,
      RegionCkeck,
      TitleCheck
    );
  };

  const onRegionChanged = (
    stateId: string,
    cityId: string,
    regionId: string
  ) => {
    if (cityId === "" && stateId === "" && regionId === "") {
      setTempRegion([]);
      onFilterApplied(
        categories,
        reqTypes,
        mySkills,
        implementationTypes,
        date,
        sortData,
        [],
        title
      );
      return;
    }

    const AllTempRegions = [stateId, cityId, regionId];

    onFilterApplied(
      categories,
      reqTypes,
      mySkills,
      implementationTypes,
      date,
      sortData,
      AllTempRegions,
      title
    );

    setTempRegion(AllTempRegions);
  };

  const CategoryFiller = async () => {
    const res: IResult = await service.getCategoryFiller();
    setHasCategory(true);
    setCategories(
      res.Data.map((c: any) => {
        return { name: c.name, id: c.id, isChecked: false };
      })
    );
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
    } else {
      return [regions[0], regions[1], regions[2]];
    }
  };

  //I don't use Usestate because cause More refresh page and I forced use more work
  const onFilterApplied = (
    categories: ICheckable[],
    reqTypes: ICheckable[],
    mySkills: ICheckable[],
    implementationTypes: ICheckable[],
    date: any,
    sortData: any,
    tempRegion: string[],
    title: string | undefined
  ) => {
    const filter: IFilterDaily = {
      skip: 0,
      take: 12,
      dailyRequestSorts: sortData ?? null,
      requestType: idsListNumber(reqTypes),
      title: title ? title : null,
      regions: Regions(tempRegion),
      beginDate: stringBegibDate(date),
      endDate: stringEndDate(date),
      presenceType: idsListNumber(implementationTypes),
      requestCategoryId: idsListMaker(categories),
      requestUserCategoryId: idsListMaker(mySkills),
    };
    onFilter(filter);
  };

  return (
    <>
      {hasCategory && (
        <div className="filters-container">
          {matchesMd && (
            <Paper className="filters-paper-title">
              <Serach
                label="موضوع"
                value={title}
                onValueChanged={(t) => {
                  onFilterApplied(
                    categories,
                    reqTypes,
                    mySkills,
                    implementationTypes,
                    date,
                    sortData,
                    tempRegion,
                    t
                  );
                  setTitle(t);
                }}
              />
            </Paper>
          )}
          <SimpleFilter
            title="دسته بندی ها"
            list={categories}
            onFilterChanged={(c: any) => {
              onFilterApplied(
                c,
                reqTypes,
                mySkills,
                implementationTypes,
                date,
                sortData,
                tempRegion,
                title
              );
              setCategories(c);
            }}
            searchable
          />
          {isSuggest === "suggest" && (
            <SimpleFilter
              title="نوع درخواست"
              list={reqTypes}
              onFilterChanged={(c) => {
                onFilterApplied(
                  categories,
                  c,
                  mySkills,
                  implementationTypes,
                  date,
                  sortData,
                  tempRegion,
                  title
                );
                setReqTypes(c);
              }}
            />
          )}
          {isSuggest != "suggest" && mySkills.length > 0 && (
            <SimpleFilter
              title="مهارتهای من"
              list={mySkills}
              onFilterChanged={(c) => {
                onFilterApplied(
                  categories,
                  reqTypes,
                  c,
                  implementationTypes,
                  date,
                  sortData,
                  tempRegion,
                  title
                );
                setMySkills(c);
              }}
              searchable
            />
          )}
          <SimpleFilter
            title="نحوه انجام کار"
            list={implementationTypes}
            onFilterChanged={(c) => {
              onFilterApplied(
                categories,
                reqTypes,
                mySkills,
                c,
                date,
                sortData,
                tempRegion,
                title
              );
              setImplementationTypes(c);
            }}
          />
          <DateFilter
            LastSelect={date}
            titleName="تاریخ انجام کار"
            onDateFiltered={(c) => {
              onFilterApplied(
                categories,
                reqTypes,
                mySkills,
                implementationTypes,
                c,
                sortData,
                tempRegion,
                title
              );
              setDate(c);
            }}
          />
          <TabBtnsFilter
            LastSelect={tempRegion}
            onFilterChanged={onRegionChanged}
          />
        </div>
      )}
    </>
  );
}

export default Filters;
