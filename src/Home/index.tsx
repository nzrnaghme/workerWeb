import "./index.scss";
import { Link, useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Search from "./Search";
import RequestsCategory, { ReqsCategoryType } from "./RequestsCategory";
import Button from "../Components/Button";
import ButtonBase from "@material-ui/core/ButtonBase";
// import premierServants from "../Images/root/Banner-Hamyaran-Web.png";
import premierServants from "../Images/root/supply-Pc.png";

import whyUs from "../Images/root/Banner-Yootaab-Web.png";
import yootaabOnMobile from "../Images/root/SP-Banner.png";
import emergent from "../Images/root/Banner-Fori-Mobile.png";
import suggested from "../Images/root/Banner-Pishnahadi-Mobile.png";
import daily from "../Images/root/Banner-Rozmare-Mobile.png";
import reqRegister from "../Images/root/Banner-Sabte-Darkhast-Mobile.png";
import search from "../Images/root/Jostoo-Mobile.png";
// import busyFamilyAdventures from "../Images/root/Banner-Hamyaran-Mobile.png";
import busyFamilyAdventures from "../Images/root/supply-mob.png";

import * as service from "./service";
import { IPresentableRequest } from "../Registers/DailyRequestContainList/Entities";
import { toast } from "react-toastify";
import { showLocalStorage } from "../Routers/localStorage";
import { ProfileImageAndState } from "../Registers/Requests/AddRequest/Entities";
import { trackPromise } from "react-promise-tracker";
export const Supply = (window as any).SUPPLY_WEB;

const msg6 = "عکس پروفایل شما تایید و یا ثبت نشده است";
const msg12 = "لطفا در پروفایل خود استان را وارد کنید.";
const msg13 =
  "عکس پروفایل شما تایید و یا ثبت نشده است، استان در پروفایل وارد نشده است.";

function Home() {
  const history = useHistory();
  const isMobileView = useMediaQuery("(max-width: 40rem)");
  const storageUser = showLocalStorage("user");
  const [suggestShowRequest, setSuggestShowRequest] = useState<boolean>(false);
  const [itemsEmergancy, setItemsEmergancy] = useState<
    IPresentableRequest[] | []
  >([]);
  const [itemsSuggest, setItemsSuggest] = useState<IPresentableRequest[] | []>(
    []
  );

  const [mobileSearchDialog, setMobileSearchDialog] = useState(false);

  useEffect(() => {
    trackPromise(EmergancyRequest());
  }, []);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      if (storageUser != undefined) {
        if (storageUser !== null) {
          setSuggestShowRequest(true);
          trackPromise(SuggestRequest(storageUser.Id));
          return;
        }
      }
    }
    setSuggestShowRequest(false);
  }, []);

  const EmergancyRequest = async () => {
    const res = await service.GetEmergencyRequest();
    if (res.Error) {
      toast.error("مشکل در ارتباط با سرور");
      return;
    }
    const AllData = res.Data as IPresentableRequest[];
    setItemsEmergancy(AllData);
  };

  const SuggestRequest = async (id: string) => {
    const res = await service.GetSuggestedRequest(id);
    const AllData = res.Data as IPresentableRequest[];

    if (AllData) {
      setItemsSuggest(AllData);
    }
    return;
  };

  const checkImageAndState = async () => {
    if (storageUser && storageUser.Id) {
      const res = await service.hasUserPictureAndState(storageUser.Id);
      if (res.Error != null) return;
      switch (res.Data) {
        case ProfileImageAndState.HasNotImage:
          toast.warning(msg6);
          break;
        case ProfileImageAndState.HasNotState:
          toast.warning(msg12);
          break;
        case ProfileImageAndState.HasNotImageAndState:
          toast.warning(msg13);
          break;
        case ProfileImageAndState.HasImageAndState:
          history.push("/AddRequest");
          break;
      }
    } else history.push("/Login");
  };

  const desktopView = (
    <>
      <Search />
      {itemsEmergancy.length != 0 && (
        <RequestsCategory type={ReqsCategoryType.Emergent} />
      )}
      {suggestShowRequest && itemsSuggest.length != 0 && (
        <>
          <RequestsCategory type={ReqsCategoryType.Suggested} />
        </>
      )}
      <div className="more-info-banners-container">
        <Link to="/why-yootaab">
          <ButtonBase className="link-img-btn-wrapper">
            <img src={whyUs} alt="" />
          </ButtonBase>
        </Link>
        <div
          onClick={() => {
            window.open(
              Supply(storageUser.RefreshToken, storageUser.AccessToken)
            );
          }}
        >
          <ButtonBase className="link-img-btn-wrapper">
            <img src={premierServants} alt="" />
          </ButtonBase>
        </div>
      </div>
      <RequestsCategory type={ReqsCategoryType.Daily} />
      <section className="footer-banner-section">
        <div className="footer-banner-container">
          <div className="footer-banner-ad">
            <p className="footer-banner-ad-brand-name">ای‌رول</p>
            <p className="footer-banner-ad-slogan">
              همیار شما در مشکلات روزمره
            </p>
            <p className="footer-banner-ad-caption">
              با ثبت رایگان درخواست ها و ارتباط مستقیم با همیاران در ای‌رول، در
              سریع ترین زمان نزدیکترین همیار را برای حل مشکلات روزمره خود
              بیابید.
            </p>
            <Button
              label="راهنمای کاربری ای‌رول"
              color="blue"
              size="lg"
              onClick={() => history.push("/usage-guide")}
            />
          </div>
          <div className="footer-banner">
            <img src={yootaabOnMobile} alt="" />
          </div>
        </div>
      </section>
    </>
  );

  const mobileView = (
    <>
      <Search
        searchDialoqOpen={mobileSearchDialog}
        onSearchCancel={() => setMobileSearchDialog(false)}
      />
      <section className="mobile-section">
        <Link to="/RequestList/emergancy" className="item1">
          <ButtonBase className="link-img-btn-wrapper">
            <img src={emergent} alt="" />
          </ButtonBase>
        </Link>
        <Link to="/RequestList/suggest" className="item2">
          <ButtonBase className="link-img-btn-wrapper">
            <img src={suggested} alt="" />
          </ButtonBase>
        </Link>
        <Link to="/RequestList" className="item3">
          <ButtonBase className="link-img-btn-wrapper">
            <img src={daily} alt="" />
          </ButtonBase>
        </Link>
        <div onClick={checkImageAndState} className="item4">
          <ButtonBase className="link-img-btn-wrapper">
            <img src={reqRegister} alt="" />
          </ButtonBase>
        </div>
        <ButtonBase
          className="item5"
          onClick={() => setMobileSearchDialog(true)}
        >
          <img src={search} alt="" />
        </ButtonBase>
        <div
          onClick={() => {
            window.open(
              Supply(storageUser.RefreshToken, storageUser.AccessToken)
            );
          }}
          className="item6"
        >
          <ButtonBase className="link-img-btn-wrapper">
            <img src={busyFamilyAdventures} alt="" />
          </ButtonBase>
        </div>
      </section>
    </>
  );

  return !isMobileView ? desktopView : mobileView;
}

export default Home;
