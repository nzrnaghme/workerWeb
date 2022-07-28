import { useState, useEffect } from "react";

let timerInterval: any;

const useTimer = () => {
  const [counter, setCounter] = useState(0);
  const [timer, setTimer] = useState("00:00");

  useEffect(() => {
    return () => clearInterval(timerInterval);
  }, []);

  const onStartTimer = () => {

    timerInterval = setInterval(() => {
      let minutes;
      let seconds;

      setCounter((counter) => {
        const newCounter = counter + 1;
        minutes = Math.floor(newCounter / 60);
        seconds = newCounter % 60;
        return newCounter;
      });

      seconds = ("0" + seconds).slice(-2);
      minutes = ("0" + minutes).slice(-2);

      setTimer(`${minutes}:${seconds}`);
    }, 1000);
  };

  const onPauseTimer = () => {
    clearInterval(timerInterval);
  };

  const onStopTimer = () => {
    clearInterval(timerInterval);
    setCounter(0);
    setTimer("00:00");
  };

  return { timer, counter, onStartTimer, onPauseTimer, onStopTimer };
};

export default useTimer;
