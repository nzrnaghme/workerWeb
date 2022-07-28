import { useState, useEffect } from "react";
import { toPersianNumber } from "../../Components/hooks/persianHelper";
import classes from "./Timer.module.scss";

type props = {
  timerNumber: number;
  onFinished: (isFinish: boolean) => void;
};
function Timer({ timerNumber, onFinished }: props) {
  const [progress, setProgress] = useState(timerNumber);

  useEffect(() => {
    setProgress(timerNumber);
  }, [timerNumber]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress > 0) {
        setProgress(progress - 1);
      } else {
        onFinished(true);
        return;
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [progress]);

  return (
    <div className={classes.center}>
      <span className={classes.ring}>
        <span className={classes.ball} />
        <span className={classes.time}>{toPersianNumber(progress)}</span>
      </span>
    </div>
  );
}
export default Timer;
