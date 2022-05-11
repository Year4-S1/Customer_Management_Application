import pino from 'pino';
import dayjs from 'dayjs';

const LOG = pino({
  prettyPrint: true,
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

export default LOG;