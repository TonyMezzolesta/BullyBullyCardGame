const app = require("./app");

app.listen(process.env.PORT || "3030", () => {
  console.info(`TRT API listening on port ${process.env.PORT || "3030"}`);
});