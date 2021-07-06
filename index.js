import sendEmail from "./lib/send.js"
import { settings } from "./lib/settings.js"

const mailOptions = {
  from: settings.senderEmail,
  to: settings.receiverEmail,
  subject: "Sending Dynamic Email using Node.js",
  text: "Mock Email!",
  template: "mock",
  templateVars: {
    emailAddress: "test@gmail.com",
  },
}

await sendEmail(mailOptions)
