const pickQuery = (objQuery) =>
  Object.entries(objQuery).reduce((qrObj, q) => {
    if (q[1]) {
      return { ...qrObj, [q[0]]: q[1] };
    }
  }, {});

module.exports = {
  pickQuery,
};
