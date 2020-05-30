const app = require("./app");

app.listen(process.env.PORT || "3031", () => {
  console.info(`API listening on port ${process.env.PORT || "3031"}`);
});