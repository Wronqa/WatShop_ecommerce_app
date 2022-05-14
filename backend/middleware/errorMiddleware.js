const errorMiddleware = (err, req, res, next) => {
  let message = err.message || 'Server error'
  let errorCode = err.errorCode || 500

  if (err.name === 'CastError') {
    message = 'Product not found'
    errorCode = 404
  } else if (err.name === 'TokenExpiredError') {
    message = 'You are not authenticated'
    errorCode = 407
  }

  res.status(errorCode).json({
    success: false,
    message,
  })
}

module.exports = errorMiddleware
