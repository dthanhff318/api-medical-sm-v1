const moment = require("moment");

const pickQuery = (objQuery) =>
  Object.entries(objQuery).reduce((qrObj, q) => {
    if (q[1]) {
      return { ...qrObj, [q[0]]: q[1] };
    }
  }, {});

const getTotalQuantityByMonth = (data, month) => {
  const quanityMonth = data
    .filter((e) => e.createdTime.split("-")[1] === month)
    .reduce((acc, cur) => [...acc, ...cur.data], [])
    .reduce((total, cur) => (total += cur.quantity), 0);
  return quanityMonth;
};

const getTotalQuantityExportByMonth = (data, month) => {
  const newList = data.map((e) => ({
    ...e._doc,
    createdTime: moment(e.createdTime, "DD MMM YYYY").format("DD-MM-YYYY"),
  }));
  const quanityMonth = newList
    .filter((e) => e.createdTime.split("-")[1] === month)
    .reduce((acc, cur) => [...acc, ...cur.planList], [])
    .reduce((total, cur) => (total += cur.quantity), 0);
  return quanityMonth;
};

const getTotalQuantityByMonthByGroup = (data, month, group) => {
  const quanity = data
    .filter((e) => e.createdTime.split("-")[1] === month)
    .reduce((acc, cur) => [...acc, ...cur.data], [])
    .filter((e) => e.group === group)
    .reduce((total, cur) => (total += cur.quantity), 0);
  return quanity;
};

const getTotalQuantityExportByMonthByGroup = (data, month, group) => {
  const newList = data.map((e) => ({
    ...e._doc,
    createdTime: moment(e.createdTime, "DD MMM YYYY").format("DD-MM-YYYY"),
  }));
  console.log(
    newList
      .filter((e) => e.createdTime.split("-")[1] === month)
      .reduce((acc, cur) => [...acc, ...cur.planList], [])
  );
  const quanityMonth = newList
    .filter((e) => e.createdTime.split("-")[1] === month)
    .reduce((acc, cur) => [...acc, ...cur.planList], [])
    .filter((e) => e.group === group)
    .reduce((total, cur) => (total += cur.quantity), 0);
  return quanityMonth;
};
module.exports = {
  pickQuery,
  getTotalQuantityByMonth,
  getTotalQuantityExportByMonth,
  getTotalQuantityByMonthByGroup,
  getTotalQuantityExportByMonthByGroup,
};
