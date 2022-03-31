import * as winston from 'winston'
import WinstonGraylog2 from 'winston-graylog2';
import Sentry from 'winston-sentry'

const winstonConsoleFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.prettyPrint(),
  winston.format.colorize(),
)

const graylogFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.metadata(),
  winston.format.prettyPrint(),
)

function getTransports(name: string): (winston.transport | WinstonGraylog2)[] {
  const console = new winston.transports.Console({ format: winstonConsoleFormat, level: 'info' })
  const transports: (winston.transport | WinstonGraylog2)[] = [console];
  const graylog = new WinstonGraylog2({
    level: 'debug',
    name,
    format: graylogFormat,
    graylog: {
      servers: [{host: process.env.GRAYLOG_HOST, port: 12201}],
      facility: name
    }
  })
  const sentry = new Sentry({
    level: 'error',
    dsn: process.env.SENTRY_DSN,
    tags: { key: name },
  })
  if (process.env.NODE_ENV == "production") {
    transports.push(graylog, sentry)
  }
  return transports;
}

/**
 * Logger for express, specifically requests. Will pick upp all requests from
 * express and log it to the requests.log file.
 */
export const expressLogger = winston.createLogger({
  transports: getTransports('express') as winston.transport[],
})

/**
 * Socket logger, will log all events to the socket server
 */
export const socketLogger = winston.createLogger({
  defaultMeta: {service: 'socket'},
  transports: getTransports('socket') as winston.transport[],
})

/**
 * All-purpose logger, used for logging errors and other info
 */
export const logger = winston.createLogger({
  defaultMeta: {service: 'Server'},
  transports: getTransports('Server') as winston.transport[],
})
