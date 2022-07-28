import "./index.scss";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Navigation() {
  const location = useLocation();
  const [navigation, setNavigation] = useState("");

  useEffect(() => {
    const pathname = location.pathname;

    if (pathname.includes("Profile")) setNavigation("پروفایل");
    else if (pathname.includes("RegisterUser")) setNavigation("ثبت نام");
    else if (pathname.includes("AddRequest")) setNavigation("ثبت درخواست");
    else if (pathname.includes("EditRequest")) setNavigation("ویرایش درخواست");
    else if (pathname.includes("IncreaseWallet")) setNavigation("شارژ کیف پول");
    else if (pathname.includes("WalletTransaction"))
      setNavigation("تراکنش های کیف پول");
    else if (pathname.includes("emergancy")) setNavigation("درخواست های فوری");
    else if (pathname.includes("suggestions")) setNavigation("");
    else if (pathname.includes("suggest")) setNavigation("درخواست های پیشنهادی");
    else if (pathname.includes("MyRequestList")) setNavigation("درخواست های من");
    else if (pathname.includes("MyCurrentRequestList"))
      setNavigation("درخواست های فعال من");
    else if (pathname.includes("RequestList"))
      setNavigation("درخواست های روزمره");
    else if (pathname.includes("MyServantRequest")) setNavigation("خدمات من");
    else if (pathname.includes("MyCurrentServantRequest"))
      setNavigation("خدمات فعال من");
    else if (pathname.includes("DetailRequestClient")) setNavigation("همیاران");
    else if (pathname.includes("DetailRequest"))
      setNavigation("جزئیات درخواست");
    else if (pathname.includes("requestconfirm"))
      setNavigation("تایید درخواست");
    else if (pathname.includes("WaitingToArrived"))
      setNavigation("انتظار تا رسیدن");
    else if (pathname.includes("requestworking")) setNavigation("شروع کار");
    else if (pathname.includes("survey")) setNavigation("نظرسنجی");
    else if (pathname.includes("busy-family-adventures"))
      setNavigation("خانواده سر شلوغ");
    else setNavigation("");
  }, [location.pathname]);

  return <p className="navigation">{navigation}</p>;
}

export default Navigation;
