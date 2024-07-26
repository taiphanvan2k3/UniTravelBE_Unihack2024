const paypal = require('@paypal/checkout-server-sdk');
const nodemailer = require('nodemailer');
const fs = require('fs');

// PayPal config
const environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
);
const paypalClient = new paypal.core.PayPalHttpClient(environment);

// Mail config
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

const sendEmail = async (emailDetails) => {
    try {
        const { recipientEmail, recipientName, amount, transactionId, eventName, eventDate, eventTime, eventLocation } = emailDetails;

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
                Payment Confirmation
            </div>
            <div class="body">
                <h1>Hello, ${{recipientName}}!</h1>
                <p>Thank you for your payment. Your transaction has been successfully processed.</p>
                <p><strong>Transaction Details:</strong><br>
                Amount: ${{amount}}<br>
                Transaction ID: ${{transactionId}}</p>
                <p>Your ticket details are as follows:</p>
                <ul>
                    <li>Event: ${{eventName}}</li>
                    <li>Date: ${{eventDate}}</li>
                    <li>Time: ${{eventTime}}</li>
                    <li>Location: ${{eventLocation}}</li>
                </ul>
                <p>Please keep this information for your records.</p>
                <p>If you have any questions or need further information, please do not hesitate to contact us.</p>
                <p>Best Regards,<br>The First Time</p>
            </div>
            <div class="footer">
                © 2024 Company Name, Inc.
            </div>
        </div>
        </body>
        </html>`;

        let info = await transporter.sendMail({
            from: `"The First Time" <${process.env.SMTP_USER}>`,
            to: recipientEmail,
            subject: "Payment Confirmation and Ticket Details",
            html: htmlTemplate
        });

        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
};

class SocialController {
    async createPayment(req, res, next) {
        try {
            const request = new paypal.orders.OrdersCreateRequest();
            request.prefer("return=representation");
            request.requestBody({
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: 'USD',
                        value: '100.00'
                    }
                }]
            });
            const response = await paypalClient.execute(request);
            res.status(201).json(response.result);
        } catch (error) {
            res.status(400).json({
                message: error.message,
            });
            next(error);
        }
    }

    async capturePayment(req, res, next) {
        try {
            const request = new paypal.orders.OrdersCaptureRequest(req.body.orderId);
            request.requestBody({});
            const response = await paypalClient.execute(request);
            res.status(200).json(response.result);
        } catch (error) {
            res.status(400).json({
                message: error.message,
            });
            next(error);
        }
    }
    
    async sendEmail(req, res, next) {
        try {
            const emailDetails = {
                recipientEmail: req.body.email,
                recipientName: req.body.name,
                amount: req.body.amount,
                transactionId: "abc123",
                eventName: req.body.eventName,
                eventDate: req.body.eventDate,
                eventTime: req.body.eventTime,
                eventLocation: req.body.eventLocation
            };

            const info = await sendEmail(emailDetails);
            res.status(200).json(info);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new SocialController();
