module.exports = function getData(soket) {
  return new Promise((resolve, reject) => {
    soket.on("data", (data) => {
      resolve(data.toString().trim());
    });
  });
};
