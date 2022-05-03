const getActivationMessage = (req, activationToken) => {
  return `Your activation link is: \n\n ${req.protocol}://${req.get(
    'host'
  )}/api/auth/activate/${activationToken}`
}

module.exports = getActivationMessage
