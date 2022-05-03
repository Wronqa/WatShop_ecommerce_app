const sendTokens = (user, code, res) => {
  const { accessToken, refreshToken } = user.getJWTTokens()

  const { password, _id, accountStatus, updatedAt, __v, ...others } =
    user.toJSON()

  res.cookie('access_token', accessToken, {
    expires: new Date(Date.now() + 0.5 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
  })

  res.cookie('refresh_token', refreshToken, {
    expires: new Date(Date.now() + 480 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
  })

  res.json({
    success: true,
    user: others,
  })

  res.status(code).send()
}

module.exports = sendTokens
