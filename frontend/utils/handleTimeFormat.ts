const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  //   @ts-ignore
  const formattedTime = date.toLocaleTimeString([], options);

  // Thay thế dấu cách không ngắt dòng (U+202F) bằng dấu cách bình thường (U+0020)
  return formattedTime.replace(/\u202F/g, " ");
};

export default formatTime;

function convertToISOString(timeString: string) {
  const today = new Date();
  const [time, period] = timeString.split(" ");
  const [hour, minute] = time.split(":").map(Number);
  let hours = hour;

  // Convert 12-hour format to 24-hour format
  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  // Set local time on today's date
  today.setHours(hours, minute, 0, 0);

  // Extract components
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const hourStr = String(today.getHours()).padStart(2, "0");
  const minuteStr = String(today.getMinutes()).padStart(2, "0");
  const secondStr = String(today.getSeconds()).padStart(2, "0");

  // Manually add timezone offset +07:00
  const offset = "+07:00";

  return `${year}-${month}-${day}T${hourStr}:${minuteStr}:${secondStr}${offset}`;
}
export { convertToISOString };
