import fs from "fs";
import handlebars from "handlebars";
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const { compile } = handlebars;
// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Set up Handlebars for email templates
transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extname: ".hbs",
      partialsDir: path.join(__dirname, "./emails"), // Path to partials (if any)
      defaultLayout: "",
    },
    viewPath: path.join(__dirname, "./emails"), // Path to email templates
    extName: ".hbs",
  })
);

/**
 * Sends an email using Handlebars templates.
 * @param {string} to - Recipient email.
 * @param {string} subject - Email subject.
 * @param {string} template - Handlebars template name (without extension).
 * @param {object} context - Data to inject into the template.
 */
 
const sendEmail = async (to: string, subject: string, template: string, context: object) => {
  try {
    const templatePath = path.join(__dirname, "/emails", `${template}.hbs`);
    const templateSource = fs.readFileSync(templatePath, "utf8");
    const compiledTemplate = compile(templateSource);
    const html = compiledTemplate(context);

    await transporter.sendMail({
      from: `"Cinema App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendEmail;
