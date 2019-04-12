var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var now = require('performance-now');

// var instream = fs.createReadStream('test.txt');
var instream = fs.createReadStream('itcont.txt');

var outstream = new stream();
var rl = readline.createInterface(instream, outstream);

//get line count for file
var lineCount = 0;

// create array list of names
var names = [];

// donations occurring in each month
var dateDonationCount = [];
var dateDonations = {};

// list of first names, and most common first name
var firstNames = [];
var dupeNames = {};

var t0 = now();
var t1;
var t2 = now();
var t3;
var t4 = now();
var t5;
var t6 = now();
var t7;

console.time('line count');
console.time('names');
console.time('most common first name');
console.time('total donations for each month');

rl.on('line', function(line) {
  // increment line count
  lineCount++;

  // get all names
  var name = line.split('|')[7];
  names.push(name);

  // get all first halves of names
  var firstHalfOfName = name.split(', ')[1];
  if (firstHalfOfName !== undefined) {
    firstHalfOfName.trim();
    // filter out middle initials
    if (firstHalfOfName.includes(' ') && firstHalfOfName !== ' ') {
      firstName = firstHalfOfName.split(' ')[0];
      firstName.trim();
      firstNames.push(firstName);
      dupeNames[firstName] = (dupeNames[firstName] || 0) + 1;
    } else {
      firstNames.push(firstHalfOfName);
      dupeNames[firstHalfOfName] = (dupeNames[firstHalfOfName] || 0) + 1;
    }
  }

  // year and month
  var timestamp = line.split('|')[4].slice(0, 6);
  var formattedTimestamp = timestamp.slice(0, 4) + '-' + timestamp.slice(4, 6);
  dateDonationCount.push(formattedTimestamp);
  dateDonations[formattedTimestamp] =
    (dateDonations[formattedTimestamp] || 0) + 1;
});

rl.on('close', function() {
  // total line count
  t1 = now();
  console.log(lineCount);
  console.timeEnd('line count');
  console.log(
    `Performance now line count timing: ` + (t1 - t0).toFixed(3) + `ms`,
  );

  // names at various points in time
  console.log(names[432]);
  console.log(names[43243]);
  t3 = now();
  console.timeEnd('names');
  console.log(`Performance now names timing: ` + (t3 - t2).toFixed(3) + `ms`);

  // most common first name
  var sortedDupeNames = Object.entries(dupeNames);

  sortedDupeNames.sort((a, b) => {
    return b[1] - a[1];
  });
  console.log(sortedDupeNames[0]);
  t5 = now();
  console.timeEnd('most common first name');
  console.log(
    `Performance now first name timing: ` + (t5 - t4).toFixed(3) + `ms`,
  );
  const name = sortedDupeNames[0][0];
  const nameOccurrences = sortedDupeNames[0][1];
  console.log(
    `The most common name is '${name}' with ${nameOccurrences} occurrences.`,
  );

  // number of donations per month
  logDateElements = (key, value, map) => {
    console.log(
      `Donations per month and year: ${value} and donation count ${key}`,
    );
  };
  new Map(Object.entries(dateDonations)).forEach(logDateElements);
  t7 = now();
  console.timeEnd('total donations for each month');
  console.log(
    `Performance now donations per month timing: ` +
      (t7 - t6).toFixed(3) +
      `ms`,
  );
});
