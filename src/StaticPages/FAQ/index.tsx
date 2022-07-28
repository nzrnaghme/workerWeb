import { useState } from "react";
import "./index.scss";
import { Title, Paragraph } from "../components";
import ButtonBase from "@material-ui/core/ButtonBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import {
  q1,
  q2,
  q3,
  q4,
  q5,
  q6,
  q7,
  q8,
  q9,
  q10,
  q11,
  answer1,
  answer2,
  answer3,
  answer4,
  answer5,
  answer6,
  answer7,
  answer8,
  answer9,
  answer10,
  answer11,
} from "./contents";

type QuestionProps = {
  question: React.ReactChild;
  answer: React.ReactChild;
  show?: boolean;
};

const Question = ({ question, answer, show = false }: QuestionProps) => {
  const [showAnswer, setShowAnswer] = useState(show);

  return (
    <div className="frequently-asked-question">
      <header
        className={`frequently-asked-question-header ${
          showAnswer && "bordered"
        }`}
        onClick={() => setShowAnswer((prevS) => !prevS)}
      >
        <p>{question}</p>
        <ButtonBase className="f-a-q-toggle-btn">
          <FontAwesomeIcon
            id="trash-icon"
            icon={showAnswer ? faAngleUp : faAngleDown}
          />
        </ButtonBase>
      </header>
      {showAnswer && <Paragraph>{answer}</Paragraph>}
    </div>
  );
};

function FAQ() {
  return (
    <div className="frequently-asked-questions">
      <section className="usage-guide-heading">
        <Title>سوالات متداول</Title>
        <Question question={q1} answer={answer1} show />
        <Question question={q2} answer={answer2} />
        <Question question={q3} answer={answer3} />
        <Question question={q4} answer={answer4} />
        <Question question={q5} answer={answer5} />
        <Question question={q6} answer={answer6} />
        <Question question={q7} answer={answer7} />
        <Question question={q8} answer={answer8} />
        <Question question={q9} answer={answer9} />
        <Question question={q10} answer={answer10} />
        <Question question={q11} answer={answer11} />
      </section>
    </div>
  );
}

export default FAQ;
