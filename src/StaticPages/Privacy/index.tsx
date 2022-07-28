import "./index.scss";
import * as contents from "./contents";
import { Title, Paragraph } from "../components";

function Privacy() {
  return (
    <div className="privacy">
      <Title>سیاست حریم شخصی</Title>
      <Paragraph>{contents.intro}</Paragraph>
      <div className="privacy-q-and-a">
        <Paragraph>{contents.q1}</Paragraph>
        <Paragraph>{contents.answer1}</Paragraph>
      </div>

      <div className="privacy-q-and-a">
        <Paragraph>{contents.q2}</Paragraph>
        <Paragraph>{contents.answer2}</Paragraph>
      </div>

      <div className="privacy-q-and-a">
        <Paragraph>{contents.q3}</Paragraph>
        <Paragraph>{contents.answer3}</Paragraph>
      </div>

      <div className="privacy-q-and-a">
        <Paragraph>{contents.q4}</Paragraph>
        <Paragraph>{contents.answer4}</Paragraph>
      </div>
    </div>
  );
}

export default Privacy;
