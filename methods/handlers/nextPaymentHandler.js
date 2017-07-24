var nextPaymentHandler = function (req, res) {
    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here: https://dashboard.stripe.com/account/apikeys
    var stripe = require("stripe")("pk_test_6zLTl66mCBKJihsb5xN6i6qZ");

    if (!req.body.subscriptionid) res.status(400).send('Subscription id is not provided');

    stripe.subscriptions.retrieve(
        req.body.subscriptionid,
        function (err, subscription) {
            // asynchronously called
            if (err) {
                res.status(400).send(err);
            } else {
                let nextPaymentDate = subscription.current_period_end;
                //return nextpayment date
                res.json({ nextPaymentDate: nextPaymentDate });
            }
        }
    );
};


module.exports = nextPaymentHandler;