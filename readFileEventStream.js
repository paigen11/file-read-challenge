var fs = require('fs'),
  es = require('event-stream');
var now = require('performance-now');

var totalLines = 0;
var names = [];
var firstNames = [];
var dupeNames = {};
var dateDonationCount = [];
var dateDonations = {};
var t0 = now();
var t1 = now();

var s = fs
  // .createReadStream('test.txt')
  .createReadStream('itcont.txt')
  // .createReadStream('/Users/pxn5096/Downloads/indiv18/itcont.txt')
  .pipe(es.split())
  .pipe(
    es
      .mapSync(function(line) {
        console.time('line count');
        t0 = now();

        totalLines++;

        // get all names
        console.time('names');
        t0 = now();
        var name = line.split('|')[7];
        if (totalLines === 433 || totalLines === 43244) {
          names.push(name);
        }

        // get all first halves of names
        console.time('most common first name');
        t0 = now();
        var firstHalfOfName = name.split(', ')[1];

        if (firstHalfOfName !== undefined) {
          firstHalfOfName.trim();

          // filter out middle initials
          if (firstHalfOfName.includes(' ') && firstHalfOfName !== ' ') {
            firstName = firstHalfOfName.split(' ')[0];
            firstName.trim();
            firstNames.push(firstName);
          } else {
            firstNames.push(firstHalfOfName);
          }
        }

        // year and month
        console.time('total donations for each month');
        t0 = now();
        var timestamp = line.split('|')[4].slice(0, 6);
        var formattedTimestamp =
          timestamp.slice(0, 4) + '-' + timestamp.slice(4, 6);
        dateDonationCount.push(formattedTimestamp);
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
          `Performance now line count timing: ` + (t1 - t0).toFixed(3),
        );

        // console.log(names[432]);
        console.log(names);
        t1 = now();
        console.timeEnd('names');
        console.log(`Performance now names timing: ` + (t1 - t0).toFixed(3));

        // most common first name
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
          `Performance now first name timing: ` + (t1 - t0).toFixed(3),
        );

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
        t1 = now();
        console.timeEnd('total donations for each month');
        console.log(
          `Performance now donations per month timing: ` + (t1 - t0).toFixed(3),
        );
      }),
  );
