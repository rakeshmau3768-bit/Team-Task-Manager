const { connectDB } = require("./src/config/db");
const { PORT } = require("./src/config/env");
const app = require("./src/app");

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
