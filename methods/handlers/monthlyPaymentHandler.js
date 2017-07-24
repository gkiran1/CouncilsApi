var monthlyPaymentHandler = function (req, res) {
    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here: https://dashboard.stripe.com/account/apikeys
    var stripe = require("stripe")("pk_test_6zLTl66mCBKJihsb5xN6i6qZ");

    // Token is created using Stripe.js or Checkout!
    // Get the payment token submitted by the form:
    var token = req.body.stripeToken; // Using Express
    var plan = stripe.plans.create({
        name: "Basic Monthly Plan",
        id: "basic-monthly-" + token,
        interval: "month",
        currency: "usd",
        amount: req.body.amount,
    }, function (err, plan) {
        // asynchronously called
        if (err) {
            res.status(400).send(err);
        } else {

            var customer = stripe.customers.create({
                email: req.body.email,
                source: token
            }, function (err, customer) {
                // asynchronously called
                if (err) {
                    res.status(400).send(err);
                } else {
                    stripe.subscriptions.create({
                        customer: customer.id,
                        plan: plan.id,
                    }, function (err, subscription) {
                        // asynchronously called
                        if (err) {
                            res.status(400).send(err);
                        } else {
                            //store the suscription id in DB for future reference.
                            storeToDB(req, customer, subscription);
                            res.json({ msg: "your request has been processed", id: subscription.id });
                        }
                    });
                }
            });
        }
    });

};


var storeToDB = function (req, customer, subscription) {
    var admin = require("firebase-admin");
    var db = admin.database();
    db.ref("subscriptions").push({
        userid: req.body.userid,
        amount: subscription.plan.amount / 100,
        fullname: req.body.fullname,
        email: req.body.email,
        donationtype: req.body.donationtype,
        customerid: customer.id,
        subscriptionid: subscription.id,
        card: {
            number: req.body.cardNo,
            exp_month: customer.sources.data[0].exp_month,
            exp_year: customer.sources.data[0].exp_year
        }
    });
}
module.exports = monthlyPaymentHandler;