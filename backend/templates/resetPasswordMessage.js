const getResetPasswordMessage = (req, resetToken) => {
  return `Your password reset link is: \n\n ${req.protocol}://${req.get(
    'host'
  )}/api/auth/reset/${resetToken}`
}

module.exports = getResetPasswordMessage
