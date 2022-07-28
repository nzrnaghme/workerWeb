export const stringToTime = (timeString: string) => {
  let time = new Date();
  const split = timeString.split(":");
  time.setHours(parseInt(split[0]));
  time.setMinutes(parseInt(split[1]));
  return time;
};

export const timeToString = (time: Date) => {
  let min = time.getMinutes();
  let minString = min > 9 ? min : "0" + min;

  let hour = time.getHours();
  let hourString = hour > 9 ? hour : "0" + hour;

  return hourString + ":" + minString;
};

export const concatDateAndTime = (date: Date, time: Date) => {
  let dateString = date.toJSON().toString().split("T")[0];
  let timeString = timeToString(time);
  return dateString + "T" + timeString;
};

export const addTime = (date: Date, time: string) => {
  let spiltTime = time.split(':');
  let hour = parseInt(spiltTime[0]);
  let min = parseInt(spiltTime[1]);

  date.setHours(date.getHours() + hour);
  date.setMinutes(date.getMinutes() + min);
  return date;
};

export const concatDateAndTimeInString = (date: string, time: string) => {
  let dateString = date.toString().split("T")[0];
  return dateString + "T" + time + ":00";
};
