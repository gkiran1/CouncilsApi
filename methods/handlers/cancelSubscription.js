var cancelSubscriptionHandler = function (req, res) {
    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here: https://dashboard.stripe.com/account/apikeys
    var stripe = require("stripe")("sk_test_rOEvg4We5LrciAzhUhFzS7ah");

    if (!req.body.subscriptionid) res.status(400).send('Subscription id is not provided');

    stripe.subscriptions.del(
        req.body.subscriptionid,
        function (err, confirmation) {
            // asynchronously called
            if (err) {
                res.status(400).send(err);
            } else {
                res.json({ msg: 'Successfully Unsubscribed!' });
            }
        }
    );
};


module.exports = cancelSubscriptionHandler;