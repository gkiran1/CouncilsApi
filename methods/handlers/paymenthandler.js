var paymentHandler = function (req, res) {
    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here: https://dashboard.stripe.com/account/apikeys
    var stripe = require("stripe")("sk_test_rOEvg4We5LrciAzhUhFzS7ah");

    // Token is created using Stripe.js or Checkout!
    // Get the payment token submitted by the form:
    var token = req.body.stripeToken; // Using Express

    // Charge the user's card:
    var charge = stripe.charges.create({
        amount: req.body.amount,
        currency: "usd",
        description: "donation",
        source: token,
        receipt_email: req.body.email
    }, function (err, charge) {
        if (err) {
            console.log('error occured while processing your request', err);
            res.status(400).send(err);
        } else {
            let message = "your request has been processed";
            console.log(message);
            storeToDB(req, charge);
            res.json({ msg: message });

        }
    });
};

var storeToDB = function (req, charge) {
    var admin = require("firebase-admin");
    var db = admin.database();
    db.ref("donations").push({
        amount: charge.amount / 100,
        fullname: req.body.fullname,
        email: req.body.email,
        donationtype: req.body.donationtype,
        chargeid: charge.id,
        card: {
            number: req.body.cardNo,
            exp_month: charge.source.exp_month,
            exp_year: charge.source.exp_year
        }
    });
}
module.exports = paymentHandler;