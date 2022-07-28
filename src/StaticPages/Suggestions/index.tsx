import "./index.scss";
import { par1, address, phoneNumber, email } from "./contents";
import { Title, Paragraph } from "../components";
import { toPersianNumber } from "../../Components/hooks/persianHelper";
import mailImg from "../../Images/staticPages/icons/mail.png";
import phoneImg from "../../Images/staticPages/icons/phone.png";
import mapImg from "../../Images/staticPages/icons/map.png";
import MapContainer from "../../Components/Maps/MapContainer";

const contactMethod = (icon: any, text: string) => (
  <div>
    <div className="contact-icon-title-wrapper">
      <div className="contact-icon">
        <img src={icon} alt=" " />
      </div>
    </div>
    <Paragraph>{text}</Paragraph>
  </div>
);

function Suggestions() {
  const location = {
    latitude: 35.75671058542473,
    longitude: 51.32262291003036,
    name: "",
    date: "2022-01-23T12:08:33.178Z",
  };

  return (
    <div className="suggestions">
      <Title>ارسال پيشنهادات</Title>
      <Paragraph>{par1}</Paragraph>
      <div className="contact-methods">
        {contactMethod(mapImg, toPersianNumber(address))}
        {contactMethod(phoneImg, toPersianNumber(phoneNumber))}
        {contactMethod(mailImg, email)}
      </div>
      <div className="suggestions-map-wrapper">
        <MapContainer
          canDelete={false}
          userLocation={false}
          center={[location.longitude, location.latitude]}
          clientLocation={location}
          servantLocation={null}
          disabled
          onLocationChange={() => {}}
        />
      </div>
    </div>
  );
}

export default Suggestions;
