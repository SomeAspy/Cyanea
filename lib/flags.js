const args = process.argv.slice(2);

export let debug;
if (args.find(arg => arg === "--debug")) {
    console.log("[Info]: Running in debug mode!".blue);
    debug = true;
} else {
    debug = false;
}

export let devMode;
if (args.find(arg => arg === "--dev")) {
    console.log("[Info]: Running in development mode!".blue);
    devMode = true;
} else {
    devMode = false;
}

export let verbose;
if (args.find(arg => arg === "--verbose")) {
    console.log("[Info]: Running in verbose mode!".blue);
    verbose = true;
} else {
    verbose = false;
}