"use strict";

const fs = require('fs');
const readline = require('readline');
const { performance: perf } = require('perf_hooks');

/**
 * Finds the largest value of all fields in `obj`
 * and returns its field name (key).
 */
function maxEntry(obj) {
    let maxValue = 0;
    let maxKey = null;
    for (let key of Object.keys(obj)) {
        if (obj[key] > maxValue) {
            maxKey = key;
            maxValue = obj[key];
        }
    }
    return maxKey;
}

function getFirstName(name) {
    let firstHalfOfName = name.split(', ')[1];
    if (firstHalfOfName !== undefined) {
        firstHalfOfName.trim();
        // filter out middle initials
        if (firstHalfOfName.includes(' ') && firstHalfOfName !== ' ') {
            let firstName = firstHalfOfName.split(' ')[0];
            return firstName.trim();
        } else {
            return firstHalfOfName;
        }
    }
}

function getFirstNameRegEx(name) {
    // the documentation assures me that a regex in this form is compiled at parse-time
    // and is indeed a constant in memory.
    const regex = /, (\S+)/;
    const match = regex.exec(name);
    return match && match[1];
}

const numberFormat4 = new Intl.NumberFormat('en-us', { maximumSignificantDigits: 4 });
const numberFormatFull = new Intl.NumberFormat('en-us');

function main(args) {
    console.log(`Opening file '${args[0]}'.`)
    const rl = readline.createInterface({
        input: fs.createReadStream(args[0]),
        crlfDelay: Infinity,
    });

    const timeStartReadLoop = perf.now();
    let timeInsideReadLoop = 0;

    const nameCounts = {};
    let lineCount = 0;
    rl.on('line', (line) => {
        const timeStartInside = perf.now();
        lineCount++;
        const fields = line.split('|');
        const date = fields[4];
        const name = getFirstNameRegEx(fields[7]);   // to count full names, just use `fields[7];`
        nameCounts[name] = (nameCounts[name] || 0) + 1;
        timeInsideReadLoop += perf.now() - timeStartInside;
    });

    rl.on('close', function() {
        const totalTime = numberFormat4.format(perf.now() - timeStartReadLoop);
        const insideTime = numberFormat4.format(timeInsideReadLoop);
        console.log(`Total time for reading and processing file: ${totalTime}ms.`);
        console.log(`Thereof time spent in custom processing code: ${insideTime}ms.`)

        console.log(`Dataset has ${numberFormatFull.format(lineCount)} entries.`);

        const numUniqueNames = numberFormatFull.format(Object.keys(nameCounts).length);
        console.log(`${numUniqueNames} different names found in file.`)

        const name = maxEntry(nameCounts);
        const nameOccurrences = numberFormatFull.format(nameCounts[name]);
        console.log(`The most common name is '${name}' with ${nameOccurrences} occurrences.`);
    });

    console.log(`Getting started...`);
}

// note that in older versions of node, you need to `.splice(process.execArgv.length + 2)`
// but my v10.15 seems to already remove the runtime's arguments from the program's.
main(process.argv.splice(2));
