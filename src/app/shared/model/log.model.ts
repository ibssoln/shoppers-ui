export enum LogLevel{
	INFO = 'INFO',
	DEBUG = 'DEBUG',
	ERROR = 'ERROR'
}

export class Log{
	private timestamp: string;
	private level: string;
	private message: string;

	constructor(timestamp: string, level: string, message: string){
		this.timestamp = timestamp;
		this.level = level;
		this.message = message;	
	}

}