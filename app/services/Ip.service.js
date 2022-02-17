const axios = require("axios").default;

exports.getLocation = (requestIP) => {
  axios
    .get("http://ip-api.com/json/" + "90.11.35.136")
    .then(function (response) {
      // handle success
      return response.data;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
};
