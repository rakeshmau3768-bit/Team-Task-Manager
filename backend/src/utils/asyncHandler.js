const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.log("ERROR =>", err);
    next(err);
  });
};

module.exports = { asyncHandler };