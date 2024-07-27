const nodemailer = require("nodemailer");

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
            amount,
            transactionId,
            eventName,
            eventDate,
            location,
        } = emailDetails;

        const redirectUrl = `${process.env.FRONTEND_URL}/payment-confirmation?transactionId=${transactionId}`;
        let htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                width: 100%;
                max-width: 600px;
                background: #ffffff;
                margin: 0 auto;
                padding: 20px;
                box-shadow: 0 0 5px rgba(0,0,0,0.1);
            }
            .header {
                background-color: #007bff;
                color: #ffffff;
                padding: 10px 20px;
                text-align: center;
                font-size: 24px;
            }
            .body {
                padding: 20px;
                text-align: left;
                font-size: 16px;
            }
            .footer {
                text-align: center;
                padding: 10px 20px;
                background-color: #eeeeee;
            }
        </style>
        </head>
        <body>
        <div class="container">
            <div class="header">
                <a href="">Payment Confirmation</a>
            </div>
            <div class="body">
                <h1>Hello, ${recipientName}!</h1>
                <p>Thank you for your payment. Your transaction has been successfully processed.</p>
                <p><strong>Transaction Details:</strong><br>
                Amount: ${amount}<br>
                Transaction ID: ${transactionId}</p>
                <p>Your ticket details are as follows:</p>
                <ul>
                    <li>Location: ${location}</li>
                    <li>Event: ${eventName}</li>
                    <li>DateTime: ${eventDate}</li>
                </ul>
                <p>Please keep this information for your records.</p>
                <p>If you have any questions or need further information, please do not hesitate to contact us.</p>
                <p>Best Regards,<br>The First Time</p>
            </div>
            <div class="footer">
                UniTravel © 2024 Company Name, Inc.
            </div>
        </div>
        </body>
        </html>`;

        let info = await transporter.sendMail({
            from: `"The First Time" <${process.env.SMTP_USER}>`,
            to: recipientEmail,
            subject: "Payment Confirmation and Ticket Details",
            html: htmlTemplate,
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
