const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const { getCurrentDateTimeFormatted } = require("../../helpers/utils");

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

const sendEmailPayment = async (emailDetails) => {
    try {
        const {
            recipientEmail,
            recipientName,
            transactionId,
            location,
            tickets,
            amount,
        } = emailDetails;

        const paymentTemplatePath = path.join(
            __dirname,
            "payment-template.html"
        );
        const itemRowTemplatePath = path.join(__dirname, "item-row.html");
        let htmlPaymentTemplate = fs.readFileSync(paymentTemplatePath, "utf8");
        const htmlItemRowTemplate = fs.readFileSync(
            itemRowTemplatePath,
            "utf8"
        );

        let itemsHtml = tickets
            .map((item) => {
                return htmlItemRowTemplate
                    .replace("{{ticketType}}", item.ticketType)
                    .replace(
                        "{{quantity}}",
                        String(item.quantity).padStart(2, "0")
                    )
                    .replace("{{price}}", item.price)
                    .replace("{{total}}", item.quantity * item.price);
            })
            .join("");
        htmlPaymentTemplate = htmlPaymentTemplate
            .replace("{{recipientName}}", recipientName)
            .replace("{{transactionId}}", transactionId)
            .replace("{{eventDate}}", getCurrentDateTimeFormatted())
            .replace("{{location}}", location)
            .replace("{{items}}", itemsHtml)
            .replace("{{totalPrice}}", amount);

        let info = await transporter.sendMail({
            from: `"The First Time" <${process.env.SMTP_USER}>`,
            to: recipientEmail,
            subject: "Payment Confirmation and Ticket Details",
            html: htmlPaymentTemplate,
        });

        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Failed to send email:", error);
        throw error;
    }
};

module.exports = {
    sendEmailPayment,
};
