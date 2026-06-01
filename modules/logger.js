import winston from "winston";
import LokiTransport from 'winston-loki'

const logger = winston.createLogger()

logger.add(new winston.transports.Console({
  format: winston.format.json(),
  level: 'info'
}))

const lokiHost = process.env.LOKI_HOST
if (lokiHost) {
  logger.add(new LokiTransport({
    host: lokiHost,
    json: true,
    basicAuth: `${process.env.LOKI_USER || ''}:${process.env.LOKI_PASS || ''}`,
    labels: { job: 'yaroshenko.tools' }
  }))
}

export default logger
