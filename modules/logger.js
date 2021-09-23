const winston = require('winston')
const LokiTransport = require('winston-loki')
const logger = winston.createLogger()

logger.add(new winston.transports.Console({
  format: winston.format.json(),
  level: 'info'
}))

logger.add(new LokiTransport({
  host: process.env.LOKI_HOST,
  json: true,
  basicAuth: `${process.env.LOKI_USER}:${process.env.LOKI_PASS}`,
  labels: { job: 'yaroshenko.tools' }
}))

export default logger
