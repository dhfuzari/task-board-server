const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
	const healthcheck = {
		uptime: process.uptime(),
		message: 'OK',
		timestamp: Date.now()
	};
	try {
		res.send(healthcheck);
	} catch (e) {
		healthcheck.message = e;
		res.status(503).send();
	}
});

module.exports = app => app.use('/healthcheck', router);