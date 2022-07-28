import React, { useEffect, useState } from "react";
import { Suspense } from "react";
import { IRequestInSearch, ISearchRequest } from "./Entites";
import * as service from "./IServices";
import { toast } from "react-toastify";
import * as ServiceAccept from "../DailyRequestContainList/IService";
import { useHistory, useParams } from "react-router-dom";
import { trackPromise } from "react-promise-tracker";

function SearchRequest() {
  const match = useParams<any>();
  const [filter] = useState<ISearchRequest>({
    userId: match.userId === "null" ? null : match.userId,
    textFilter: match.textFilter === "null" ? null : match.textFilter,
    rootFilter: match.rootFilter === "null" ? null : Number(match.rootFilter),
    stateId: match.stateId === "null" ? null : match.stateId,
  });
  const [items, setItems] = useState<IRequestInSearch[] | []>([]);
  // const [emptyRequestToSearch, setEmptyRequestToSearch] = useState(false);
  const [hasImage, setHasImage] = useState<boolean>(false);
  const history = useHistory();

  useEffect(() => {
    trackPromise(search(filter));
    if (filter.userId) {
      trackPromise(checkImageProfile());
    }
  }, []);

  const search = async (filter: ISearchRequest) => {
    setItems([]);
    // setEmptyRequestToSearch(false);
    const res = await service.postAllUserRequest(filter);
    const AllData = res.Data;
    // if (AllData.length == 0) {
    //   setEmptyRequestToSearch(true);
    //   return;
    // }
    setItems(AllData);
  };

  const checkImageProfile = async () => {
    let profile = await service.getCheckProfile(filter.userId!);
    setHasImage(profile.Data);
  };

  const checkAcceptRequest = async (id: string, userIdRequest: string) => {
    if (filter.userId != undefined) {
      if (filter.userId !== "null") {
        if (filter.userId === userIdRequest) {
          toast.error("شما نمی توانید درخواست خود را پذیرش نمایید!");
          return;
        } else {
          if (hasImage) {
            //true correct
            const { Data: checkRequest } = await ServiceAccept.getCheckRegister(
              userIdRequest,
              id
            );
            if (checkRequest === false) {
              toast.error("به دلیل لغو این درخواست،اجازه پذیرش مجدد ندارید.");
              return;
            } else {
              moveInsertRequest(id, userIdRequest);
              return;
            }
          } else {
            toast.warning("عکس پروفایل شما تایید یا ثبت نشده است");
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

  const OtherComponent = React.lazy(
    () => import("./Components/RequestSearchGrid")
  );

  return (
    <>
      {/* {!emptyRequestToSearch && ( */}
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <OtherComponent
            items={items}
            callBackAddRequest={(
              requestRegistrationId: string,
              userIdRequest: string
            ) => {
              trackPromise(
                checkAcceptRequest(requestRegistrationId, userIdRequest)
              );
            }}
          />
        </Suspense>
      </div>
      {/*   )}*/}
      {items.length === 0 && (
        <div
          style={{
            padding: "1rem",
            boxShadow:
              "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
            height: "fit-content",
            borderRadius: "0.5rem",
            boxSizing: "border-box",
          }}
        >
          درخواستی با این فیلتر وجود ندارد...
        </div>
      )}
    </>
  );
}

export default SearchRequest;
