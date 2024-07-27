const paypal = require("@paypal/checkout-server-sdk");
const mailService = require("../services/email/email.service");

// PayPal config
const environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
);
const paypalClient = new paypal.core.PayPalHttpClient(environment);

class SocialController {
    async createPayment(res, next) {
        try {
            const request = new paypal.orders.OrdersCreateRequest();
            request.prefer("return=representation");
            request.requestBody({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "USD",
                            value: "100.00",
                        },
                    },
                ],
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
            const request = new paypal.orders.OrdersCaptureRequest(
                req.body.orderId
            );
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
                location: req.body.location,
            };

            const info = await mailService.sendEmailPayment(emailDetails);
            res.status(200).json(info);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new SocialController();
