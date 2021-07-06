import ejs from "ejs"
import fs from "fs"
import { htmlToText } from "html-to-text"
import juice from "juice"
import nodemailer from "nodemailer"
import { settings } from "./settings.js"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: settings.username,
    pass: settings.password,
  },
})

export default ({ template: templateName, templateVars, ...restOfOptions }) => {
  const templatePath = `lib/templates/${templateName}.html`
  const options = {
    ...restOfOptions,
  }

  if (templateName && fs.existsSync(templatePath)) {
    const template = fs.readFileSync(templatePath, "utf-8")
    const html = ejs.render(template, templateVars)
    const text = htmlToText(html)
    const htmlWithStylesInlined = juice(html)

    options.html = htmlWithStylesInlined
    options.text = text
  }

  transporter.sendMail(options, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log("Email sent: " + info.response)
    }
  })
}
