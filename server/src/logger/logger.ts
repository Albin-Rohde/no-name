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

/**
 * Logger for express, specifically requests. Will pick upp all requests from
 * express and log it to the requests.log file.
 */
export const expressLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({ format: winstonConsoleFormat }),
    new WinstonGraylog2({
      level: 'debug',
      name: 'express',
      format: graylogFormat,
      graylog: {
        servers: [{host: process.env.GRAYLOG_HOST, port: 12201}],
        facility: "express"
      }
    }),
    new Sentry({
      level: 'error',
      dsn: process.env.SENTRY_DSN,
      tags: { key: 'express-logger' },
    })
  ],
})

/**
 * Socket logger, will log all events to the socket server
 */
export const socketLogger = winston.createLogger({
  defaultMeta: {service: 'socket'},
  transports: [
    new winston.transports.Console({ format: winstonConsoleFormat, level: 'silly' }),
    new WinstonGraylog2({
      level: 'silly',
      format: graylogFormat,
      name: 'socket',
      graylog: {
        servers: [{host: process.env.GRAYLOG_HOST, port: 12201}],
        facility: "server"
      }
    }),
    new Sentry({
      level: 'error',
      dsn: process.env.SENTRY_DSN,
      tags: { key: 'socket-logger' },
    })
  ],

})

/**
 * All purpose logger, user for logging errors and other info's
 */
export const logger = winston.createLogger({
  defaultMeta: {service: 'Server'},
  transports: [
    new winston.transports.Console({ format: winstonConsoleFormat, level: 'silly' }),
    new WinstonGraylog2({
      level: 'silly',
      name: 'logger',
      format: graylogFormat,
      graylog: {
        servers: [{host: process.env.GRAYLOG_HOST, port: 12201}],
        facility: "server"
      }
    }),
    new Sentry({
      level: 'error',
      dsn: process.env.SENTRY_DSN,
      tags: { key: 'logger' },
    })
  ],
})
