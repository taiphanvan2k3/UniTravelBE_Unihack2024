const paypal = require("@paypal/checkout-server-sdk");
const mailService = require("../services/email/email.service");

// PayPal config
const environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
);
const paypalClient = new paypal.core.PayPalHttpClient(environment);

class SocialController {
    async createPayment(req, res, next) {
        try {
            if (!req.body.price) {
                return res.status(400).json({ message: "Price is required." });
            }

            let price = Number(req.body.price);
            console.log(`Price: ${price}`);
            if (isNaN(price) || price <= 0) {
                return res
                    .status(400)
                    .json({ message: "Invalid or negative price format." });
            }

            const exchangeRate = 25321.3;
            let usdPrice = price / exchangeRate;

            // Ensure the converted price is greater than zero
            if (usdPrice <= 0) {
                return res.status(400).json({
                    message: "Converted USD amount must be greater than zero.",
                });
            }

            // Format the price to two decimal places
            usdPrice = usdPrice.toFixed(2);

            console.log(`Converted USD Price: ${usdPrice}`);

            const request = new paypal.orders.OrdersCreateRequest();
            request.prefer("return=representation");
            request.requestBody({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "USD",
                            value: usdPrice.toString(),
                        },
                    },
                ],
            });

            const response = await paypalClient.execute(request);
            res.status(201).json(response.result);
        } catch (error) {
            // console.error('Error in createPayment:', error);
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
            next(error);
        }
    }

    async sendEmail(req, res, next) {
        try {
            console.log(req.body.orderData);
            const { orderData, locationName, tickets } = req.body;
            const emailDetails = {
                recipientEmail: orderData.payer.email_address,
                recipientName:
                    orderData.payer.name.surname +
                    " " +
                    orderData.payer.name.middle_name +
                    " " +
                    orderData.payer.name.given_name,
                amount: orderData.purchase_units.length,
                transactionId: orderData.id,
                location: locationName,
                tickets,
            };

            const info = await mailService.sendEmailPayment(emailDetails);
            res.status(200).json(info);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new SocialController();
