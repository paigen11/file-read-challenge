const fs = require('fs');
const readline = require('readline');

const args = process.argv.splice(process.execArgv.length + 2);

// Node v11 integrations streams with its async/await feature,
// making our task even easier. But I'll stay with the LTS so my code
// won't accidentally rot while I am not upgrading it.
async function processLineByLine() {
    const rl = readline.createInterface({
        input: fs.createReadStream(args[0]),
        crlfDelay: Infinity
    });

    var count = 0;
    for await (const line of rl) {
        count++;
    }
    console.log('File has ' + count + ' lines.')
}

processLineByLine();