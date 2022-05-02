// const asyncErrorMiddleware = (func) => (req, res, next) => {
//   Promise.resolve(func(req, res, next)).catch(next)
// }

const asyncErrorMiddleware = (func) => async (req, res, next) => {
  try {
    await func(req, res, next)
  } catch (err) {
    next(err)
  }
}

module.exports = asyncErrorMiddleware
