const commander = require('commander');

import {MemoryLimitPolicyEnum} from './enums';
import Logger from './log';

commander
  .option('--config <config>', 'Path to config file')
  .parse(process.argv);

if (!commander.config) {
  commander.help();
}

let config;
try {
  config = JSON.parse(require('fs').readFileSync(commander.config));
} catch (readErr) {
  Logger.fatal(`Failed to read config: ${readErr}`);
}

// Base options.
const optionsBase = {
  server: {
    port: 6380
  },

  persistence: {
    enabled: false,
    dbPath: '',
    writeInterval: 0// seconds
  },

  store: {
    maxSize: 0, // bytes
    memoryLimitPolicy: MemoryLimitPolicyEnum.MEMORY_LIMIT_POLICY_ERROR,
  },
};

class Options {
}

const opts = Object.assign(optionsBase, config);

export default opts;
