const normalizePort = (value) => {
  const port = parseInt(value, 10)

  if (isNaN(port)) {
    return value
  }
  if (port > 0) {
    return value
  }

  return false
}

module.exports = normalizePort
