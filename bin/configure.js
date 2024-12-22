#!/usr/bin/env node
import readline from 'readline';
import dotenv from 'dotenv';
import stream from 'stream';
import path from 'path';
import url from 'url';
import fs from 'fs';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * ----------------------------------------------
 * ------ TYPE DEFS, ENUMS, & CONSTANTS ---------
 * ----------------------------------------------
 */

/**
 * @typedef {Object} ConfigurationArgs
 * @property {Environment} environment
 */

/**
 * @typedef {Object} EnvironmentVariableConfig
 * @property {string} name
 * @property {string} label
 * @property {string} default
 * @property {boolean} masked
 */

/**
 * @typedef {Object} EnvironmentVariables
 * @property {string} MYSQL_HOST
 * @property {string} MYSQL_DATABASE
 * @property {string} MYSQL_USER
 * @property {string} MYSQL_PASSWORD
 * @property {string} LOG_FILE_PATH
 * @property {string} RECAPTCHA_SITE_KEY
 * @property {string} RECAPTCHA_SECRET_KEY
 */

/**
 * @readonly
 * @enum {string}
 */
const Environment = Object.freeze({
    dev: 'dev',
    staging: 'staging',
    production: 'production'
});

/**
 * @type {Array<EnvironmentVariableConfig>}
 */
const ENVIRONMENT_VARIABLE_CONFIGS = Object.freeze([
    {
        name: 'MYSQL_HOST',
        label: 'MySQL Host',
        default: 'localhost'
    },
    {
        name: 'MYSQL_DATABASE',
        label: 'MySQL Database',
        default: 'typescript_server_starter_kit'
    },
    {
        name: 'MYSQL_USER',
        label: 'MySQL User',
        default: 'mysql'
    },
    {
        name: 'MYSQL_PASSWORD',
        label: 'MySQL Password',
        masked: true
    },
    {
        name: 'LOG_FILE_PATH',
        label: 'Log File Path',
        default: path.resolve('logs')
    },
    {
        name: 'RECAPTCHA_SITE_KEY',
        label: 'ReCaptcha Site Key'
    },
    {
        name: 'RECAPTCHA_SECRET_KEY',
        label: 'ReCaptcha Secret Key',
        masked: true
    }
]);

/**
 * ----------------------------------------------
 * -------------- HELPER METHODS ----------------
 * ----------------------------------------------
 */

/**
 * @description Print help message
 */
function printHelp() {
    console.log('Configure environment variables for this project.\n');
    console.log(`-e, --environment : Specify the environment you will be configuring. Options are [${ENVIRONMENTS.join(', ')}]. Default is dev`);
    console.log('-h, --help : Show this help dialog\n');
}

/**
 * @description Get configuration args from cli input
 * @returns {ConfigurationArgs}
 */
function getCliArgs() {
    /**
     * Default args
     * @type {ConfigurationArgs}
     */
    const args = {
        environment: 'dev'
    };
    for (let i = 2; i < process.argv.length; i++) {
        const [key, value] = process.argv[i].split('=');
        switch (key) {
            case '-e':
            case '--environment':
                if (value == null) {
                    args.environment = process.argv[++i];
                } else {
                    args.environment = value;
                }
                if (!Object.hasOwn(Environment, args.environment)) {
                    console.error(`Invalid environment: ${args.environment}`);
                    console.error(`Allowed values are [${ENVIRONMENTS.join(', ')}]`);
                    process.exit(1);
                }
                break;
            case '-h':
            case '--help':
                printHelp();
                process.exit(0);
            default:
                console.error(`Invalid argument: ${key}\n`);
                printHelp();
                process.exit(1);
        }
    }
    return Object.freeze(args);
}

/**
 * @description Prompt the user for environment variable value
 * @param {EnvironmentVariableConfig} config
 * @param {string} defaultValue
 */
async function captureEnvironmentVariable(config, defaultValue) {
    return new Promise((resolve, reject) => {
        defaultValue = defaultValue || config.default;
        const defaultPrompt = defaultValue ? ` (default=${config.masked ? defaultValue.replace(/./g, '*') : defaultValue})` : '';
        const rli = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        const prompt = `${config.label}${defaultPrompt}: `;
        rli.question(prompt, (result) => {
            if (config.masked) {
                rli.output.write('\n');
            }
            rli.close();
            const response = result || defaultValue;
            if (!response?.length) {
                resolve(captureEnvironmentVariable(config, defaultValue));
            } else {
                resolve(response);
            }
        });
        if (config.masked) {
            rli._writeToOutput = (str) => {
                if (str.startsWith(prompt)) {
                    rli.output.write(prompt);
                    str = str.replace(prompt, '');
                }
                for (let i = 0; i < str.length; i++) {
                    if (str.charCodeAt(i) >= 32) {
                        rli.output.write('*');
                    }
                }
            };
        }
    });
}

function trapInterrupt(draftDotenvFilePath) {
    function onExit(code) {
        console.log(`\nConfiguration interrupted. Exiting gracefully with status code ${code}...`);
        if (fs.existsSync(draftDotenvFilePath)) {
            console.log(`\nDraft saved to ${draftDotenvFilePath}\n`);
        }
        process.exit(code);
    }
    process.on('exit', onExit);
    return onExit;
}

/**
 * ----------------------------------------------
 * --------------- MAIN METHOD ------------------
 * ----------------------------------------------
 */

/**
 * @description Prompt user for environment variables
 * @param {ConfigurationArgs} args
 */
async function main(args) {
    const dotenvFileName = `.env.${args.environment}`;
    const dotenvFilePath = path.resolve(dotenvFileName);
    const draftDotenvFileName = `${dotenvFileName}.draft`;
    const draftDotenvFilePath = path.resolve(draftDotenvFileName);

    /** @type {EnvironmentVariables} */
    const oldDotenv = {};

    /** @type {EnvironmentVariables} */
    const draftDotenv = {};

    // If an old draft file was found, use it for default value
    if (fs.existsSync(draftDotenvFilePath)) {
        console.log(`Draft dotenv detected [${draftDotenvFileName}]`);
        Object.assign(draftDotenv, dotenv.parse(fs.readFileSync(draftDotenvFilePath)));
    }

    // If an existing dotenv is found, fallback on that for default values
    if (fs.existsSync(dotenvFilePath)) {
        console.log(`Active dotenv detected [${dotenvFileName}]`);
        Object.assign(oldDotenv, dotenv.parse(fs.readFileSync(dotenvFilePath)));
    }

    const onExit = trapInterrupt(draftDotenvFilePath);

    for (const config of ENVIRONMENT_VARIABLE_CONFIGS) {
        const defaultValue = draftDotenv[config.name] ?? oldDotenv[config.name] ?? config.default;
        const value = await captureEnvironmentVariable(config, defaultValue);
        if (draftDotenv[config.name]) {
            fs.writeFileSync(
                draftDotenvFilePath,
                fs.readFileSync(draftDotenvFilePath, 'utf-8').replace(`${config.name}='${draftDotenv[config.name]}'`, `${config.name}='${value}'`),
                { encoding: 'utf-8' }
            );
        } else {
            fs.appendFileSync(draftDotenvFilePath, `${config.name}='${value}'\n`, { encoding: 'utf-8' });
        }
        draftDotenv[config.name] = value;
    }

    fs.writeFileSync(dotenvFilePath, fs.readFileSync(draftDotenvFilePath));
    fs.rmSync(draftDotenvFilePath);
    process.removeListener('exit', onExit);
}

// If this script was executed directly from the cli, run the main function with cli args.
// Otherwise, this script must have been imported by another script
if (process.argv[1] === __filename) {
    console.log('Executing main');
    main(getCliArgs());
}

export default main;
