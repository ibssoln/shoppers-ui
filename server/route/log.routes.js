const express = require('express');
const { getLogger } = require('../config/functions');
const router = express.Router();
const logger = getLogger();

router.get('*', (req, res) => {

	const data = req.body;
	// console.log('body = '+data);

	// data.forEach(function(log){
	// 	switch(log.level){
	// 		// case "INFO":
	// 		// 	logger.info(log.timestamp+'-'+log.message);
	// 		// 	break;
	// 		// case "DEBUG":
	// 		// 	logger.debug(log.timestamp+'-'+log.message);
	// 		// 	break;
	// 		// case "ERROR":
	// 		// 	logger.error(log.timestamp+'-'+log.message);
	// 		// 	break;
	// 		default:
    //             console.error('haha');
	// 			logger.error(log.timestamp+'-'+log.message);
	// 			break;
	// 	}
	// });
	// return res.status(204).send({});
});

module.exports = router;