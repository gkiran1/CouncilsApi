var paymentHandler = function (req, res) {
    res.json({ success: true, msg: 'payment processed' });
};
module.exports = paymentHandler;