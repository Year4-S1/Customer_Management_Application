const pino = require('pino');
const dayjs = require('dayjs');

const LOG = pino({
  prettyPrint: true,
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

module.exports =  LOG;