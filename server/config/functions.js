const winston = require("winston");

module.exports.getLogger = function(){
	const logger = winston.createLogger();
	// const logger = winston.createLogger({
	// 	transports: [
	// 	  new (winston.transports.Console)(options.console),
	// 	  new (winston.transports.File)(options.errorFile),
	// 	  new (winston.transports.File)(options.file)
	// 	],
	// 	exitOnError: false, // do not exit on handled exceptions
	//   });
	
	// winston.createLogger({
	// 	transports: [
	// 		new winston.transports.console()
	// 	],
	// 	format: format.combine(
	// 		format.json(),
	// 		format.timestamp()
	// 	),
	// });
	return logger;
}

