exports.verifyToken = (req, res, next) => {
	console.log(req.headers['key']);
    const token = req.headers['key'];
    if (typeof token !== 'undefined' || token != null) {
        req.token = token
        next()
    } else {
        res.sendStatus(403)
    }
}