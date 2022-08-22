import nodemailer from "nodemailer";
import pug from "pug";
import mailgunTransport from "nodemailer-mailgun-transport";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { htmlToText } from "html-to-text";

const __dirname = dirname(fileURLToPath(import.meta.url));

export class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Ghost ${process.env.EMAIL_FROM}`;
    this.photo = user.photo === "default.jpg" ? true : false;
  }

  _createTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        service: "Mailgun",
        auth: {
          user: "sandboxfeeb6a11734f4b1984b5a8b7685419df.mailgun.org",
          pass: "42573ccb992bb349b174c616a8813f3f-4dd50799-f19e7bd8",
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async _send(template, subject) {
    // Render HTML based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    // Define mail options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    // create transport and send
    await this._createTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this._send("welcome", "See the World");
  }
  async sendPasswordReset() {
    await this._send("reset", "Password Reset (valid for 10 minutes only)");
  }
}
