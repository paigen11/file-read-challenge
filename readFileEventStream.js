var fs = require('fs');
var es = require('event-stream');
var now = require('performance-now');

var totalLines = 0;
var names = [];
var firstNames = [];
var dupeNames = {};
var dateDonationCount = [];
var dateDonations = {};
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

var s = fs
  // .createReadStream('test.txt')
  .createReadStream('itcont.txt')
  // .createReadStream('/Users/pxn5096/Downloads/indiv18/itcont.txt')
  .pipe(es.split())
  .pipe(
    es
      .mapSync(function(line) {
        // console.time('line count');
        totalLines++;

        // get all names
        var name = line.split('|')[7];
        if (totalLines === 433 || totalLines === 43244) {
          names.push(name);
        }

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
        var formattedTimestamp =
          timestamp.slice(0, 4) + '-' + timestamp.slice(4, 6);
        dateDonationCount.push(formattedTimestamp);
        dateDonations[formattedTimestamp] =
          (dateDonations[formattedTimestamp] || 0) + 1;
      })
      .on('error', function(err) {
        console.log('Error while reading file.', err);
      })
      .on('end', function() {
        console.log('Read entire file.');
        t1 = now();
        console.log(totalLines);
        console.timeEnd('line count');
        console.log(
          `Performance now line count timing: ` + (t1 - t0).toFixed(3) + `ms`,
        );

        t3 = now();
        console.timeEnd('names');
        console.log(
          `Performance now names timing: ` + (t3 - t2).toFixed(3) + `ms`,
        );

        sortedDupeNames = Object.entries(dupeNames);

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
      }),
  );
