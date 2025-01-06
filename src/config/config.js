global.date = new Date();
global.calender = date.toLocaleDateString("id");

global.prefix = [".", "!", "$", ""];

global.dateTime = function () {
  const moment = require("moment-timezone");
  require("moment/locale/id");
  const timezone = moment.tz("Asia/Jakarta");
  const formatTanggal = "dddd, DD MMMM YYYY";
  const formatJam = "HH:mm:ss";

  const tanggal = timezone.format(formatTanggal);
  const jam = timezone.format(formatJam);

  const datetime = { date: tanggal, time: jam };
  return datetime;
};
