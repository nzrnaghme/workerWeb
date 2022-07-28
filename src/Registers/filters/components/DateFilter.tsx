import { useEffect, useState } from "react";
import { IReqsDate } from "../Entites";
import Divider from "@material-ui/core/Divider";
import Paper from "../../../Components/Paper";
import moment from "moment";
import { toast } from "react-toastify";
import DatePickerCustome from "../../../Components/DateTimePicker/DatePickerPersian";

type DateFilterProps = {
  onDateFiltered: (date: IReqsDate) => void;
  titleName: string;
  LastSelect: IReqsDate | undefined;
};

function DateFilter({
  onDateFiltered,
  LastSelect,
  titleName,
}: DateFilterProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(LastSelect?.start);
  const [endDate, setEndDate] = useState<Date | undefined>(LastSelect?.end);

  useEffect(() => {
    if (startDate) {
      if (endDate) {
        if (
          moment(startDate).format("YYYY/MM/DD") >
          moment(endDate).format("YYYY/MM/DD")
        ) {
          setStartDate(undefined);
          toast.error("زمان اشتباه وارد شده!");
          return;
        }
      }
    }
    onDateFiltered({ start: startDate, end: endDate });
  }, [startDate]);

  useEffect(() => {
    if (endDate) {
      if (startDate) {
        if (
          moment(startDate).format("YYYY/MM/DD") >
          moment(endDate).format("YYYY/MM/DD")
        ) {
          setEndDate(undefined);
          toast.error("زمان اشتباه وارد شده!");
          return;
        }
      }
    }
    onDateFiltered({ start: startDate, end: endDate });
  }, [endDate]);

  return (
    <Paper className="filters-paper">
      <header className="filters-paper-header">
        <p className="filters-paper-header-title">{titleName}</p>
      </header>
      <Divider className="filters-paper-divider" />
      <div style={{ width: "100%" }}>
        <DatePickerCustome
          label="از"
          datePicker={startDate}
          onChangeDate={setStartDate}
          remove={() => setStartDate(undefined)}
          removable
        />
        <DatePickerCustome
          label="تا"
          datePicker={endDate}
          onChangeDate={setEndDate}
          remove={() => setEndDate(undefined)}
          removable
        />
      </div>
    </Paper>
  );
}

export default DateFilter;
