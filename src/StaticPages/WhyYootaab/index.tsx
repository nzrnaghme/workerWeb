import "./index.scss";
import { Title, Paragraph } from "../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import {
  par1,
  par2,
  par3,
  item1,
  item2,
  item3,
  item4,
  item5,
  item6,
  item7,
  item8,
  item9,
  item10,
  item11,
  item12,
} from "./contents";

const item = (text: React.ReactChild) => (
  <div className="why-us-item">
    <FontAwesomeIcon icon={faCheckCircle} className="why-us-item-icon" />
    <Paragraph>{text}</Paragraph>
  </div>
);

function WhyYootaab() {
  return (
    <div className="why-us">
      <Title>چرا ای‌رول...</Title>
      <div className="par1-wrapper">
        <Paragraph>{par1}</Paragraph>
      </div>
      <div className="why-us-items">
        {item(item1)}
        {item(item2)}
        {item(item3)}
        {item(item4)}
        {item(item5)}
        {item(item6)}
        {item(item7)}
        {item(item8)}
        {item(item9)}
        {item(item10)}
        {item(item11)}
        {item(item12)}
      </div>
      <div className="why-video-wrapper">
        <video controls>
          <source src="movie.mp4" type="video/mp4" />
          <source src="movie.ogg" type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      </div>
      <Paragraph>{par2}</Paragraph>
      <Paragraph className="why-us-below-paragraph">{par3}</Paragraph>
    </div>
  );
}

export default WhyYootaab;
