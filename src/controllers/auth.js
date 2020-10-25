const auth = (req, res) => {
    /**
     * call DB lookup for user
     *  if succeed -> 200 and redirect page
     *  if failure -> 403 FORBIDDEN
     */
    // res.status(403).end();
    res.json({ redirect: '/home' });
};
module.exports = auth;