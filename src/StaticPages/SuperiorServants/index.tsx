import "./index.scss";
import { par1 } from "./contents";
import { Title, Paragraph } from "../components";
import superiorServantsImg from "../../Images/staticPages/superior-servants.png";

function SuperiorServants() {
  return (
    <div className="superior-servants">
      <Title>همیاران برتر</Title>
      <Paragraph>{par1}</Paragraph>
      <div className="superior-servants-items-wrapper">
        {[1, 2, 3, 4, 5].map((i) => (
          <div>
            <img src={superiorServantsImg} alt="superiors" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SuperiorServants;
