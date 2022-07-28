import "./index.scss";
import * as rules from "./contents";
import { Title, Paragraph } from "../components";
import { toPersianNumber } from "../../Components/hooks/persianHelper";

function Rules() {
  return (
    <div className="rules">
      <Title>قوانین و مقررات</Title>
      <Paragraph className="rules-heading-paragragh">
        {toPersianNumber("ماده 1 - تعاریف")}
      </Paragraph>
      <Paragraph>{rules.term1}</Paragraph>
      <Paragraph>{rules.term2}</Paragraph>
      <Paragraph>{rules.term3}</Paragraph>
      <Paragraph>{rules.term4}</Paragraph>
      <Paragraph>{rules.term5}</Paragraph>
      <Paragraph>{rules.term6}</Paragraph>
      <Paragraph>{rules.term7}</Paragraph>
      <Paragraph className="rules-heading-paragragh">
        {toPersianNumber("ماده 2 - حساب کاربری")}
      </Paragraph>
      <Paragraph>{rules.r2term1}</Paragraph>
      <Paragraph>{rules.r2term2}</Paragraph>
      <Paragraph>{rules.r2term3}</Paragraph>
      <Paragraph>{rules.r2term4}</Paragraph>
      <Paragraph>{rules.r2term5}</Paragraph>
      <Paragraph className="rules-heading-paragragh">
        {toPersianNumber("ماده 3 - شرایط استفاده")}
      </Paragraph>
      <Paragraph>{rules.r3term1}</Paragraph>
      <Paragraph>{rules.r3term2}</Paragraph>
      <Paragraph>{rules.r3term3}</Paragraph>
      <Paragraph>{rules.r3term4}</Paragraph>
      <Paragraph>{rules.r3term5}</Paragraph>
      <Paragraph>{rules.r3term6}</Paragraph>
      <Paragraph className="rules-heading-paragragh">
        {toPersianNumber("ماده 4 - هزینه ها و پرداخت ها")}
      </Paragraph>
      <Paragraph>{rules.r4}</Paragraph>
      <Paragraph className="rules-heading-paragragh">
        {toPersianNumber("ماده 5 - مسئولیت ای‌رول")}
      </Paragraph>
      <Paragraph>{rules.r5term1}</Paragraph>
      <Paragraph>{rules.r5term2}</Paragraph>
      <Paragraph>{rules.r5term3}</Paragraph>
      <Paragraph>{rules.r5term4}</Paragraph>
      <Paragraph>{rules.r5term5}</Paragraph>
      <Paragraph className="rules-heading-paragragh">
        {toPersianNumber("ماده 6 - مسئولیت کاربران")}
      </Paragraph>
      <Paragraph>{rules.r6term1}</Paragraph>
      <Paragraph>{rules.r6term2}</Paragraph>
    </div>
  );
}

export default Rules;
