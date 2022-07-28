import "./index.scss";
import * as content from "./contents";
import { Title, Paragraph } from "../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const item = (text: React.ReactChild) => (
  <div className="secure-usage-guide-item">
    <FontAwesomeIcon
      icon={faCheckCircle}
      className="secure-usage-guide-item-icon"
    />
    <Paragraph>{text}</Paragraph>
  </div>
);

function SecureUsageGuide() {
  return (
    <div className="secure-usage-guide">
      <Title>راهنمای استفاده امن از ای‌رول</Title>
      <div className="par1-wrapper">
        <Paragraph>{content.par1}</Paragraph>
      </div>
      <div className="secure-usage-guide-items">
        {item(content.item1)}
        {item(content.item2)}
        {item(content.item3)}
        {item(content.item4)}
        {item(content.item5)}
        {item(content.item6)}
        {item(content.item7)}
        {item(content.item8)}
        {item(content.item9)}
        {item(content.item10)}
        {item(content.item11)}
        {item(content.item12)}
      </div>
      <div className="par2-wrapper">
        <Paragraph>{content.par2}</Paragraph>
      </div>
    </div>
  );
}

export default SecureUsageGuide;
