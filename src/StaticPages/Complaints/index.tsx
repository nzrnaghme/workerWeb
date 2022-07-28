import "./index.scss";
import { par1, par2 } from "./contents";
import { Title, Paragraph, stepsNum } from "../components";
import complaintsImg from "../../Images/staticPages/complaints.png";

function Complaints() {
  return (
    <div className="complaints">
      <Title>ثبت شکایات</Title>
      <Paragraph>{par1}</Paragraph>
      <div className="complaints-registry-steps">
        <div className="complaints-subheading">
          <div>
            <img src={complaintsImg} alt="complaints" />
          </div>
          <div>
            <div className="steps-num-wrapper">
              <Title>انتخاب دکمه ثبت شکایات</Title>
              {stepsNum(1)}
            </div>
            <Paragraph>{par2}</Paragraph>
          </div>
        </div>
        <div className="complaints-subheading">
          <div>
            <img src={complaintsImg} alt="complaints" />
          </div>
          <div>
            <div className="steps-num-wrapper">
              <Title>ثبت شکایت</Title>
              {stepsNum(2)}
            </div>
            <Paragraph>{par2}</Paragraph>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Complaints;
