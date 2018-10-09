var fs = require('fs');
var readline = require('readline');
var stream = require('stream');

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

rl.on('line', function(line) {
  // increment line count
  console.time('line count');
  lineCount++;

  // get all names
  console.time('names');
  var name = line.split('|')[7];
  names.push(name);

  // get all first halves of names
  console.time('most common first name');
  var firstHalfOfName = name.split(', ')[1];
  // filter out middle initials
  if (firstHalfOfName !== undefined && firstHalfOfName.includes(' ')) {
    firstName = firstHalfOfName.split(' ')[0];
  } else {
    firstNames.push(firstHalfOfName);
  }
  firstNames.push(firstHalfOfName);

  // year and month
  console.time('total donations for each month');
  var timestamp = line.split('|')[4].slice(0, 6);
  var formattedTimestamp = timestamp.slice(0, 4) + '-' + timestamp.slice(4, 6);
  dateDonationCount.push(formattedTimestamp);
});

rl.on('close', function() {
  // total line count
  console.log(lineCount);
  console.timeEnd('line count');

  // names at various points in time
  console.log(names[432]);
  console.log(names[43243]);
  console.timeEnd('names');

  // most common first name
  firstNames.forEach(x => {
    dupeNames[x] = (dupeNames[x] || 0) + 1;
  });
  var sortedDupeNames = [];
  for (var name in dupeNames) {
    sortedDupeNames.push([name, dupeNames[name]]);
  }
  sortedDupeNames.sort((a, b) => {
    return a[1] - b[1];
  });
  console.log(sortedDupeNames[sortedDupeNames.length - 1]);
  console.timeEnd('most common first name');

  // number of donations per month
  dateDonationCount.forEach(x => {
    dateDonations[x] = (dateDonations[x] || 0) + 1;
  });
  logDateElements = (key, value, map) => {
    console.log(
      `Donations per month and year: ${value} and donation count ${key}`,
    );
  };
  new Map(Object.entries(dateDonations)).forEach(logDateElements);
  console.timeEnd('total donations for each month');
});
