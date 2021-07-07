import sendEmail from "./lib/send.js"
import { settings } from "./lib/settings.js"
import { COVID19 } from "./lib/templates/covid19/const.js"

const mailOptions = {
  from: settings.senderEmail,
  ...COVID19,
}

await sendEmail(mailOptions)
