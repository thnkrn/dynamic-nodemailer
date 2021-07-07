import ejs from "ejs"
import fs from "fs"
import { htmlToText } from "html-to-text"
import juice from "juice"
import nodemailer from "nodemailer"
import XLSX from "xlsx"
import { settings } from "./settings.js"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: settings.username,
    pass: settings.password,
  },
})

export default ({ template: templateName, ...restOfOptions }) => {
  const templatePath = `lib/templates/${templateName}/${templateName}.html`
  const workbookPath = `lib/excelFile/${templateName}.xlsx`
  const options = {
    ...restOfOptions,
  }

  if (
    // Checking template name and file validity
    templateName &&
    fs.existsSync(templatePath) &&
    fs.existsSync(workbookPath)
  ) {
    // Reading template file
    const template = fs.readFileSync(templatePath, "utf-8")
    // Reading workbook file
    const workbook = XLSX.readFile(`lib/excelFile/${templateName}.xlsx`)

    // Processing workbook file
    const sheetData = workbook?.SheetNames
    const xlData = XLSX.utils.sheet_to_json(workbook?.Sheets[sheetData[0]])

    // Generating and sending email for each customer
    xlData?.map((customer) => {
      // Creating dynamic customer name
      const templateVars = {
        insuredName: `${customer?.CUSTNAME} ${customer?.CUSTLAST}`,
      }
      // Adding the dynamic customer name to email
      const html = ejs.render(template, templateVars)
      // Creating the fallback text file
      const text = htmlToText(html)
      // Serving HTML with inlined style
      const htmlWithStylesInlined = juice(html)

      // Adding each customer email
      options.to = customer?.EDM
      options.html = htmlWithStylesInlined
      options.text = text

      transporter.sendMail(options, function (error, info) {
        if (error) {
          console.log(error)
        } else {
          console.log("Email sent: " + info.response)
        }
      })
    })
  }
}
