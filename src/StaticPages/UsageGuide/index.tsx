import "./index.scss";
import { par1, step1, step2, step3, step4 } from "./contents";
import { Title, Paragraph, stepsNum } from "../components";
import usageGuideImg from "../../Images/staticPages/usage-guide.png";

function UsageGuide() {
  return (
    <div className="usage-guide">
      <section className="usage-guide-heading">
        <Title>راهنمای کاربری ای‌رول</Title>
        <Paragraph>{par1}</Paragraph>
      </section>
      <div className="usage-guide-img-wrapper">
        <img src={usageGuideImg} alt="about-us" />
      </div>
      <div className="usage-guide-subheading">
        <div className="steps-num-wrapper">
          <Title>ثبت درخواست و همیاری</Title>
          {stepsNum(1)}
        </div>
        <Paragraph>{step1}</Paragraph>
      </div>
      <div className="usage-guide-subheading">
        <div className="steps-num-wrapper">
          <Title>مقایسه و انتخاب</Title>
          {stepsNum(2)}
        </div>
        <Paragraph>{step2}</Paragraph>
      </div>
      <div className="usage-guide-subheading">
        <div className="steps-num-wrapper">
          <Title>مدیریت زمان</Title>
          {stepsNum(3)}
        </div>
        <Paragraph>{step3}</Paragraph>
      </div>
      <div className="usage-guide-subheading">
        <div className="steps-num-wrapper">
          <Title>انجام درخواست</Title>
          {stepsNum(4)}
        </div>
        <Paragraph>{step4}</Paragraph>
      </div>
    </div>
  );
}

export default UsageGuide;
