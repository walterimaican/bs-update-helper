/* TODO - Replace this file with custom npm module */
const readline = require('readline');

const waitForInput = async (optionalQuery) => {
    const continueQuery = '> Press [ENTER] to continue... <\n';
    const query = optionalQuery ?? continueQuery;

    const readlineInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        crlfDelay: Infinity,
    });

    return new Promise((resolve) => {
        readlineInterface.question(query, (answer) => {
            readlineInterface.close();
            resolve(answer);
        });
    });
};

module.exports = {
    waitForInput,
}