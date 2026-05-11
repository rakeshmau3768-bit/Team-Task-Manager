const { ApiError } = require("../utils/ApiError");

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.errors.map(e => e.message).join(", ");
    throw new ApiError(400, message);
  }
  req.body = result.data;
  next();
};

module.exports = { validate };