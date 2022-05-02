const errorMiddleware = (err, req, res, next) => {
  const message = err.message || 'Server error'
  const errorCode = err.errorCode || 500

  res.status(errorCode).json({
    success: false,
    message,
  })
}

module.exports = errorMiddleware
