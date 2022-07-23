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

// Create a writeStream so we can write the reformatted output to a file 

const writeStream = fs.createWriteStream( "./reformatted/test1.json", { encoding: "utf8"} );

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
         * What I wish to do is different: split every field out,
         * in order to reformat them into json-ified records.
         */

        myHdr = line.split('|')

	console.log('Elements from the header line are ' + myHdr)

  }

  if (lineCount > 1) {

	var myTrans = line.split('|')

	var jstring = "{ "

	for (i = 0; i < 21; i++) {

		/* The 13th index value is the transaction date. This needs to be reformated
		 * from a MMDDYYYY string to a YYYY-MM-DD string that can be converted to 
                 * ISO8601 date format acceptable to the MongoDB 'mongoimport' utility.
                 */

		if (i === 13) {

			var myDateStr = myTrans[i]

			var theISODt = "ISODate\(\"" + myDateStr[4] + myDateStr[5] + myDateStr[6] + myDateStr[7] + "\-" + myDateStr[0] + myDateStr[1]  +  "\-" 
			
			theISODt = theISODt + myDateStr[2] + myDateStr[3] + "T00\:00\:00Z\"" + "\)"

			jstring = jstring + "\"" + myHdr[i] + "\" : " + theISODt + "\, "
		
		}

		/* The 14th index value is the transaction amount field. Reformat this into a 
		 * $numberDecimal value (also known as Decimal128.) The value has to be formatted
                 * like so: "TRANSACTION_AMT" : {"$numberDecimal" : "120.00"} 
                 */

		else if (i === 14) {

			var myAmt = myTrans[i]

			/* Is the amount field a real number? */

			if (myAmt !== "") {

				var theContr = "\{\"\$numberDecimal\" \: \"" + myAmt + "\.00\"\}"

				jstring = jstring + "\"" + myHdr[i] + "\" : " + theContr + "\, "

//				console.log("The myTrans array " + myTrans)

//				console.log("The myAmt value " + myAmt)

//				console.log("The typeof for myAmt " + typeof myAmt)

			} else {


				var theContr = "\{\"\$numberDecimal\" \: \"0" + "\.00\"\}"

				jstring = jstring + "\"" + myHdr[i] + "\" : " + theContr + "\, "


			} 

		} 

		/* The 20th index value is the final field to be reformatted. We want to close the
		 * string with a valid JSON closing brace.
                 */

		else if (i === 20) {

		jstring = jstring + "\"" + myHdr[i] + "\" : " + "\"" + myTrans[i] + "\"" + " \}"

		} else {

		jstring = jstring + "\"" + myHdr[i] + "\" : " + "\"" + myTrans[i] + "\"\, "

	}

 } 

//	console.log(jstring)

	writeStream.write(jstring)

} } );

rl.on('close', () => {

  console.log('Number of lines processed is ' + lineCount)

})

function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}
