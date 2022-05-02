const nodemailer = require('nodemailer')
const asyncErrorMiddleware = require('../middleware/asyncErrorMiddleware')

const sendMail = async (details) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  })

  const mailDetails = {
    from: process.env.SMPT_MAIL,
    to: details.email,
    subject: details.subject,
    text: details.message,
  }

  await transporter.sendMail(mailDetails)
}

module.exports = sendMail
