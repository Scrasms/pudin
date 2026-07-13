/**
 * Converts the given timestamp to a human-readable date string
 * @param timestamp - the timestamp to be converted
 * @returns the converted date string
 */
const timestampToDate = (timestamp: string) => {
  const publishTime = new Date(timestamp);
  let date: string = publishTime.getDate().toString();
  if (Number(date) < 10) {
    date = '0' + date;
  }

  let month: string = (publishTime.getMonth() + 1).toString();
  if (Number(month) < 10) {
    month = '0' + month;
  }

  const year = publishTime.getFullYear().toString().slice(2, 4);
  return `${date}/${month}/${year}`;
};

export { timestampToDate };
