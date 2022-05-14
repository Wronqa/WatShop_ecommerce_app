const refreshTokens = new Map()

const sendTokens = (user, code, res) => {
  const { accessToken, refreshToken } = user.getJWTTokens()

  refreshTokens.set(user.username, refreshToken)

  const { password, _id, accountStatus, updatedAt, __v, ...others } =
    user.toJSON()

  res.cookie('accessToken', accessToken, {
    expires: new Date(Date.now() + 0.5 * 60 * 60 * 1000),
    httpOnly: true,
    ///secure: true,
  })

  res.cookie('refreshToken', refreshToken, {
    expires: new Date(Date.now() + 480 * 60 * 60 * 1000),
    httpOnly: true,
    ///secure: true,
    path: 'auth/refresh',
  })

  res.json({
    success: true,
    user: others,
  })

  res.status(code).send()
}
const getRefreshToken = (username) => {
  return refreshTokens.get(username)
}

module.exports = { sendTokens, getRefreshToken }
