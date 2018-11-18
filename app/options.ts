const commander = require('commander');

commander.option('--config <config>', 'Path to config file').parse(process.argv);

// Base options blueprint.
const opts = {
    http: {
        port: 3000
    },

    persistence: {
        enabled: true,
        dbPath: './test.json',
        writeInterval: 5 // seconds
    },

    store: {

    },

    verbose: true
};

if (opts.verbose) {
    // Set a convenience env var.
    process.env.OPTS_VERBOSE = 'true';
}

export default opts;