const auth = (req, res) => {
    res.json({ redirect: '/home' });
};
module.exports = auth;