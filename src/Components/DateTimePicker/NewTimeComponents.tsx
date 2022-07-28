import { useEffect, useState } from "react";
import ButtonBase from "@material-ui/core/ButtonBase";
import { TextField } from "@material-ui/core";
import TimeKeeper from "react-timekeeper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Modal from "@material-ui/core/Modal";
import { toPersianNumber } from "../hooks/persianHelper";
import "./index.scss";

export interface timeCallBack {
  time: string;
}

type props = {
  onConfirm: (time: timeCallBack) => void;
  time: string;
  label: string;
  remove?: boolean;
};

const TimePickerNewOne = ({ time, onConfirm, label, remove }: props) => {
  const [localTime, setLocalTime] = useState<string>("");
  const [timeSelected, setTimeSelected] = useState(false);
  const [clockClosed, setClockClosed] = useState(true);

  useEffect(() => {
    if (time !== "" || time !== null) {
      setLocalTime(time);
      setTimeSelected(true);
    } else {
      setTimeSelected(false);
    }
  }, []);

  useEffect(() => {
    onConfirm({
      time: localTime,
    });
  }, [localTime]);

  const removeC = () => {
    setTimeSelected(false);
    setLocalTime("");
    setClockClosed(true);
    onConfirm({
      time: "",
    });
  };

  const chooseTime = () => {
    setTimeSelected(true);
    setClockClosed(false);
  };

  useEffect(() => {
    const myTimeout = setTimeout(hours, 1);
  });

  const hours = () => {
    //hour numbers in clock
    const hour2Nums = document.getElementsByClassName(
      "css-phpjyr-numbersStyle"
    );
    for (let hourNum of hour2Nums as any) {
      hourNum.innerHTML = toPersianNumber(hourNum.innerHTML);
    }
    const hour1Nums = document.getElementsByClassName(
      "css-j4adz4-numbersStyle"
    );
    for (let hourNum of hour1Nums as any) {
      hourNum.innerHTML = toPersianNumber(hourNum.innerHTML);
    }

    //done button
    const doneBtn = document.getElementsByClassName(
      "react-timekeeper__done-button css-yo7vjg-doneButton"
    );
    for (let btn of doneBtn as any) {
      btn.innerText = "تایید";
    }

    // final hour
    const upHour: any = document.getElementsByClassName(
      "react-timekeeper__tb-hour  css-1wtkbk-time-TopBar"
    );
    for (let uH of upHour as any) {
      uH.innerText = toPersianNumber(uH.innerText);
    }

    //when active houre
    const upHourActive = document.getElementsByClassName(
      "react-timekeeper__tb-hour react-timekeeper__tb-hour--active css-1igvx5z-timeSelected-time-TopBar"
    );
    for (let uHA of upHourActive as any) {
      uHA.innerText = toPersianNumber(uHA.innerText);
    }

    // final min
    const upMin = document.getElementsByClassName(
      "react-timekeeper__tb-minute  css-nntsr1-time"
    );
    for (let uM of upMin as any) {
      uM.innerText = toPersianNumber(uM.innerText);
    }

    // when active min
    const upMinActive = document.getElementsByClassName(
      "react-timekeeper__tb-minute react-timekeeper__tb-minute--active css-rt16tf-timeSelected-time"
    );
    for (let uMA of upMinActive as any) {
      uMA.innerText = toPersianNumber(uMA.innerText);
    }
  };

  useEffect(() => {
    if (localTime === "") return;
    const myTimeout = setTimeout(m, 40);
  }, [localTime]);

  const m = () => {
    const minNums = document.getElementsByClassName("css-1ctvv7l-numbersStyle");
    for (let minNum of minNums as any) {
      minNum.innerHTML = toPersianNumber(minNum.innerHTML);
    }
  };

  return (
    <div className="date-time-picker-container">
      {timeSelected && (
        <div>
          {!clockClosed && (
            <Modal
              open={!clockClosed}
              onClose={() => setClockClosed(true)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              style={{
                display: "flex",
                textAlign: "center",
                margin: "auto",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                onClick={(s) => {
                  const upHour: any = document.getElementsByClassName(
                    "react-timekeeper__tb-hour  css-1wtkbk-time-TopBar"
                  );
                  for (let uH of upHour as any) {
                    uH.innerText = toPersianNumber(uH.innerText);
                  }
                  const upHourActive = document.getElementsByClassName(
                    "react-timekeeper__tb-hour react-timekeeper__tb-hour--active css-1igvx5z-timeSelected-time-TopBar"
                  );
                  for (let uHA of upHourActive as any) {
                    uHA.innerText = toPersianNumber(uHA.innerText);
                  }
                  setTimeout(hours, 1);
                  setTimeout(m, 1);
                }}
              >
                <TimeKeeper
                  time={time === "" ? "10:10" : time}
                  hour24Mode
                  switchToMinuteOnHourSelect
                  onDoneClick={() => {
                    setClockClosed(true);
                  }}
                  onChange={(newTime) => {
                    const myTimeout = setTimeout(hours, 1);
                    setLocalTime(newTime.formatted24);
                  }}
                />
              </div>
            </Modal>
          )}
        </div>
      )}
      <TextField
        label={label}
        variant="standard"
        size="small"
        value={timeSelected && localTime ? toPersianNumber(localTime) : ""}
        onClick={chooseTime}
        fullWidth
        inputProps={{ readOnly: true }}
        InputLabelProps={{
          shrink: true,
        }}
      />
      {remove && (
        <ButtonBase onClick={removeC} className="clear-btn">
          <FontAwesomeIcon icon={faTimes} className="clear-btn-icon" />
        </ButtonBase>
      )}
    </div>
  );
};

export default TimePickerNewOne;
