function splitString(stringToSplit, separator) {
  const arrayOfStrings = stringToSplit.split(separator);

  console.log('The original string is: "' + stringToSplit + '"');
  console.log('The separator is: "' + separator + '"');

  if (arrayOfStrings[14] === "") {
		arrayOfStrings[14] = 0
		console.log("The transaction amount has been replaced.")
	}

  if (arrayOfStrings.includes(undefined)) {

		console.log("There are undefined or empty elements in the arrayOfStrings")
  }
  console.log("The Object.values " + Object.values(arrayOfStrings))
  console.log(Object.values(arrayOfStrings).length)
  console.log(arrayOfStrings.length) 
  console.log('The array has ' + arrayOfStrings.length + ' elements: ' + arrayOfStrings.join('/'));
}

const tempestString = 'Oh brave new world that has such people in it.';
const monthString = 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec';
const monthString2 = 'Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep||Nov|Dec';
const fecString = 'C00339655|N|YE|P|201901179143856769|15|IND|COCHRAN, ERNEST W|PARIS|TX|754606333|TEXAS ONCOLOGY, P.A.|PHYSICIAN SHAREHOLDER MED ONC|12312018|||201901021615-165|1305336|||4021920191640570973'

const space = ' ';
const comma = ',';
const pipe = '|'

//splitString(tempestString, space);
//splitString(tempestString);
//splitString(monthString2, pipe);
splitString(fecString, pipe)


