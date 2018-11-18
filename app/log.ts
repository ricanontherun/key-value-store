const winston = require('winston');
const { combine, timestamp, label, printf } = winston.format;

const myFormatter = printf((info:any) => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const logFormat = combine(
    label({label: ''}),
    timestamp(),
    myFormatter
);

const info = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [
      new winston.transports.Console(),
    ]
});

const error = winston.createLogger({
    level: 'error',
    format: logFormat,
    transports: [
      new winston.transports.Console(),
    ]
});

export default class Logger {
    static info(message: string) {
        info.info(message);
    }

    static error(message: string) {
        error.error(message);
    }
}