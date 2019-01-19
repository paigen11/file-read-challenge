var fs = require('fs');
var now = require('performance-now');

var totalLines = 0;
var lines = [];
var names = [];
var firstNames = [];
var dupeNames = {};
var dateDonationCount = [];
var dateDonations = {};

var args = process.argv.splice(process.execArgv.length + 2);

fs.readFile(args[0], 'utf8', (err, contents) => {
  console.time('line count');
  let t0 = now();
  if (contents !== undefined) {
    totalLines = contents.split('\n').length - 1;
  } else {
    console.log('could not read data');
    process.exit();
  }
  console.log(totalLines);
  let t1 = now();
  console.timeEnd('line count');
  console.log(
    `Performance now line count timing: ` + (t1 - t0).toFixed(3) + `ms`,
  );

  console.time('names');
  t0 = now();
  if (contents !== undefined) {
    lines = contents.split('\n');
    lines.forEach(line => {
      var name = line.split('|')[7];
      names.push(name);
    });
  }

  console.log(names[432]);
  console.log(names[43243]);
  t1 = now();
  console.timeEnd('names');
  console.log(`Performance now names timing: ` + (t1 - t0).toFixed(3) + `ms`);

  console.time('most common first name');
  t0 = now();
  names.forEach(name => {
    var firstHalfOfName = name && name.split(', ')[1];
    if (firstHalfOfName !== undefined) {
      firstHalfOfName.trim();

      if (firstHalfOfName !== ' ' && firstHalfOfName.includes(' ')) {
        firstName = firstHalfOfName.split(' ')[0];
        firstName.trim();
        firstNames.push(firstName);
      } else {
        firstNames.push(firstHalfOfName);
      }
    }
  });

  firstNames.forEach(x => {
    dupeNames[x] = (dupeNames[x] || 0) + 1;
  });
  var sortedDupeNames = [];
  sortedDupeNames = Object.entries(dupeNames);

  sortedDupeNames.sort((a, b) => {
    return b[1] - a[1];
  });
  console.log(sortedDupeNames[0]);
  t1 = now();
  console.timeEnd('most common first name');
  console.log(
    `Performance now first name timing: ` + (t1 - t0).toFixed(3) + `ms`,
  );

  console.time('total donations for each month');
  t0 = now();
  lines.forEach(line => {
    var timestamp = line && line.split('|')[4].slice(0, 6);
    var formattedTimestamp =
      timestamp.slice(0, 4) + '-' + timestamp.slice(4, 6);
    dateDonationCount.push(formattedTimestamp);
  });

  dateDonationCount.forEach(x => {
    dateDonations[x] = (dateDonations[x] || 0) + 1;
  });
  logDateElements = (key, value, map) => {
    console.log(
      `Donations per month and year: ${value} and donation count ${key}`,
    );
  };
  new Map(Object.entries(dateDonations)).forEach(logDateElements);
  t1 = now();
  console.timeEnd('total donations for each month');
  console.log(
    `Performance now donations per month timing: ` +
      (t1 - t0).toFixed(3) +
      `ms`,
  );
});
