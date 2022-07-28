import { Link, useLocation } from "react-router-dom";
import Container from "../Components/Container";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import InstagramIcon from "@material-ui/icons/Instagram";
import TelegramIcon from "@material-ui/icons/Telegram";
import TwitterIcon from "@material-ui/icons/Twitter";
import PinterestIcon from "@material-ui/icons/Pinterest";
import Divider from "@material-ui/core/Divider";
import "./index.scss";
import emergent from "../Images/root/Offer-2.png";
import suggested from "../Images/root/Offer-3.png";
import daily from "../Images/root/Offer-1.png";

const copyRight =
  "کلیه حقوق این سایت متعلق به شرکت همیار سیستم عصر نوین (ای‌رول) است ";

const HomeMobileFooter = () => {
  return (
    <footer className="mobile-footer mobile-home-footer">
      <Link to="/about-us" className="mobile-home-footer-links">
        درباره ای‌رول
      </Link>

      <Link to="/rules" className="mobile-home-footer-links">
        قوانین و مقررات
      </Link>

      <Link to="/suggestions" className="mobile-home-footer-links">
        ارسال پیشنهادات
      </Link>
    </footer>
  );
};

const MobileFooter = () => {
  const location = useLocation();

  return location.pathname === "/" ? (
    <HomeMobileFooter />
  ) : (
    <footer className="mobile-footer">
      <Divider />
      <div className="mobile-footer-links">
        <Link to="/RequestList/emergancy" className="mobile-footer-link">
          <div className="mobile-footer-link-items">
            <div className="mobile-footer-link-icon">
              <img src={emergent} alt="" />
            </div>
            <p className="mobile-footer-link-title-emergent">درخواستهای فوری</p>
          </div>
        </Link>
        <Divider
          flexItem
          orientation="vertical"
          className="mobile-footer-links-vertical-divider"
        />
        <Link to="/RequestList/suggest" className="mobile-footer-link">
          <div className="mobile-footer-link-items">
            <div className="mobile-footer-link-icon">
              <img src={suggested} alt="" />
            </div>
            <p className="mobile-footer-link-title-suggested">
              درخواستهای پیشنهادی
            </p>
          </div>
        </Link>
        <Divider
          flexItem
          orientation="vertical"
          className="mobile-footer-links-vertical-divider"
        />
        <Link to="/RequestList" className="mobile-footer-link">
          <div className="mobile-footer-link-items">
            <div className="mobile-footer-link-icon">
              <img src={daily} alt="" />
            </div>
            <p className="mobile-footer-link-title-daily">درخواستهای روزمره</p>
          </div>
        </Link>
      </div>
    </footer>
  );
};

function Footer() {
  const isMobileView = useMediaQuery("(max-width: 40rem)");

  return isMobileView ? (
    <MobileFooter />
  ) : (
    <section className="our-footer">
      <div className="footer-main">
        <Container className="footer-main-container">
          <div className="footer-main-details">
            <div className="footer-main-detail">
              <p className="footer-main-detail-title">ای‌رول</p>
              <div className="footer-main-detail-links-wrapper">
                <Link to="/about-us" className="footer-main-detail-link">
                  درباره ای‌رول
                </Link>
                <Link to="/" className="footer-main-detail-link">
                  بلاگ
                </Link>
                <Link to="/" className="footer-main-detail-link">
                  نقشه سایت
                </Link>
              </div>
            </div>
            <div className="footer-main-detail">
              <p className="footer-main-detail-title">راهنمای مشتریان</p>
              <div className="footer-main-detail-links-wrapper">
                <Link
                  to="/frequently-asked-questions"
                  className="footer-main-detail-link"
                >
                  سوالات متداول
                </Link>
                <Link to="/rules" className="footer-main-detail-link">
                  قوانین و مقررات
                </Link>
                <Link to="/privacy" className="footer-main-detail-link">
                  سیاست حفظ حریم شخصی
                </Link>
              </div>
            </div>
            <div className="footer-main-detail">
              <p className="footer-main-detail-title">خدمات مشتریان</p>
              <div className="footer-main-detail-links-wrapper">
                <Link to="/suggestions" className="footer-main-detail-link">
                  ارسال پیشنهادات
                </Link>
                {/* <Link to="/complaints" className="footer-main-detail-link">
                  ثبت شکایات
                </Link> */}
                <Link
                  to="/secure-usage-guide"
                  className="footer-main-detail-link"
                >
                  پشتیبانی
                </Link>
              </div>
            </div>
          </div>
          <div className="footer-main-signs">
            {/* <img src={signs} alt="" /> */}
          </div>
        </Container>
      </div>
      <div className="footer-footer">
        <Container className="footer-footer-container">
          <div>
            <p className="copyright">{copyRight}</p>
          </div>
          <div className="social-media">
            <Link to="/" className="footer-main-detail-link">
              <InstagramIcon />
            </Link>
            <Link to="/" className="footer-main-detail-link">
              <TelegramIcon />
            </Link>
            <Link to="/" className="footer-main-detail-link">
              <PinterestIcon />
            </Link>
            <Link to="/" className="footer-main-detail-link">
              <TwitterIcon />
            </Link>
          </div>
        </Container>
      </div>
    </section>
  );
}

export default Footer;
