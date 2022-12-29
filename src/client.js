// Requrie's
const { io } = require("socket.io-client");
const readline = require('readline');

// Global vars
const socket = io("http://localhost:3000/").connect();
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Constants
const TOPIC_SEARCH = "search";

/**
 * Logs message
 * Note: Use \n at the start to move away from the Read Line input
 * @param {string} msg - message to log
 */
const logMessage = (msg) => console.log(`\n${msg}`);

/**
 * Logs message and exits application
 * @param {string} msg - message to log
 */
const exitApplication = (msg) => {
    logMessage(msg);
    process.exit(0);
};

/**
 * Handles Socket IO events
 */
socket.io.on("error", (error) => exitApplication(error));
socket.io.on("disconnect", (msg) => exitApplication(msg));

/**
 * Handles Socket IO TOPIC_SEARCH event
 * @param {Buffer} data - string buffer
 * @returns {searchPrompt} - returns the function
 */
socket.on(TOPIC_SEARCH, (data) => {
    if (data.page === -1) {
        logMessage(`ERR: ${data.error}`);
        return searchPrompt();
    }

    logMessage(`(${data.page}/${data.resultCount}) ${data.name} - [${data.films}]`);

    if (data.page === data.resultCount) {
        return searchPrompt();
    }
});

/**
 * Handles Read Line close event
 */
rl.on('close', () => exitApplication("\nBye!!!"));

/**
 * Handles User search input
 */
const searchPrompt = () => rl.question("\nWhat character would you like to search for? ", input => {
    if( input == "exit" ) return rl.close();
    logMessage(`Searching for ${input} ...`);
    socket.emit(TOPIC_SEARCH, {query: `${input}`});
});

/**
 * Start the application witn the User prompt
 */
searchPrompt();
