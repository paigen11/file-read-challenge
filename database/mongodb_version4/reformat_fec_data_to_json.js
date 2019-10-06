/* This code uses the Node.js readline API to read political campaign
 * donation data obtained from the United States Federal Election 
 * Commission (the "FEC".) Each line of input from the *.txt file 
 * is reformatted into an output record that is in JSON format, and 
 * uses the specific data types documented by the MongoDB version 4.x 
 * database server. 
 *
 * The specific input files being reformatted by this code are the
 * SEC records of political donations by individuals, of USD $200.00
 * or more. For example, the "indiv20.zip" file in the FEC bulk 
 * downloads area contains multiple *.txt files, each of which records
 * a political donation of $200.00 or more by a named individual. 
 * The record layout is provided in the "documentation" folder appearing
 * at the root folder of this repository.
 *
 */

const fs = require('fs');
const readline = require('readline');

//Count number of lines

var lineCount = 0;

//An array that holds the header line of the csv file.
var myHdr = [];

const rl = readline.createInterface({

  input: fs.createReadStream(process.argv[2]),

  crlfDelay: Infinity

});

// Split and save the first line -- treat that as the header line.

rl.on('line', (line) => {
  
  lineCount++
  
  if (lineCount === 1) {

        /* Code by the original author splits a line using a 
         * technique like this:
         *
	 *        myHdr = line.split('|')[3]
         *
         * It has the effect of skipping the first 3 elements and
         * capturing the fourth element -- and only the fourth. 
         *
         */

        myHdr = line.split('|')

	console.log('Elements from the header line are ' + myHdr)

  }

  if (lineCount > 1) {

	var myTrans = line.split('|')

	var jstring = "{ "

	for (i = 0; i < 3; i++) {

		jstring = jstring + "\"" + myHdr[i] + "\" : " + "\"" + myTrans[i] + "\"\, "

	}

	console.log(jstring) 

  }

});

rl.on('close', () => {

  console.log('Number of lines processed is ' + lineCount)

})


