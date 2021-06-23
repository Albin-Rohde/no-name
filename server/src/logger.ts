import * as winston from 'winston'
import * as expressWinston from 'express-winston'
import {silly} from "winston";
import fs from "fs";
import readline from "readline";

/**
 * Custom Json formatter for formatting winston log files to json
 */
const MESSAGE = Symbol.for('message');
const jsonFormatter = (logEntry) => {
  const base = { timestamp: new Date() };
  const json = Object.assign(base, logEntry)
  logEntry[MESSAGE] = JSON.stringify(json);
  return logEntry;
}

const winstonFileFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.timestamp(),
  winston.format.prettyPrint(),
  winston.format.json(),
  winston.format(jsonFormatter)()
)

const winstonConsoleFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.prettyPrint(),
)

/**
 * Logger for express, specifically requests. Will pick upp all requests from
 * express and log it to the requests.log file.
 */
export const expressLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'requests.log' }),
  ],
  format: winstonFileFormat,
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) { return false; }
})

/**
 * Socket logger, will log all events to the socket server
 */
export const socketLogger = winston.createLogger({
  format: winstonFileFormat,
  defaultMeta: {service: 'socket'},
  transports: [
    new winston.transports.Console({ format: winstonConsoleFormat }),
    new winston.transports.File({ filename: 'socket.log' }),
  ],
})

/**
 * All purpose logger, user for logging errors and other info's
 */
export const logger = winston.createLogger({
  format: winstonFileFormat,
  defaultMeta: {service: 'General'},
  transports: [
    new winston.transports.Console({ format: winstonConsoleFormat, level: 'silly' }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log',level: 'info' }),
  ],
})

interface Log {
  timestamp: string
  message: string
  level: 'info' | 'warning' | 'error'
  service: string
  stack?: string
}

interface RequestLog {
  timestamp: string
  meta: Record<any, any>
}

type LogPaths = 'combined.log' | 'error.log' | 'socket.log' | 'requests.log'

/**
 * Get all logs in a javascript array of log objects format
 * Sorted on timestamp. Oldest first
 * @param filePath
 */
export async function getLogs(filePath: LogPaths): Promise<Log[]> {
  const logs: Log[] = []
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  for await (const line of rl) {
    logs.push(JSON.parse(line))
  }
  logs.sort((a, b) => new Date(a.timestamp).valueOf() - new Date(b.timestamp).valueOf())
  return logs
}
