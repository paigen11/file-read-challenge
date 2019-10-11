# Node.js Read Large Files Challenge

The challenge is to efficiently process a really large text file sourced from the Federal Election Commission. The input data consists of records of monetary contributions by individuals to poltitical entities. 
  
Code provided in this repository is in the form of Node.js scripts. They showcase 3 different approaches to process big data files. One script utilizes the Node.js `fs.readFile()` API, another utilizes `fs.createReadSteam()`, and the final script incorporates the external NPM module `EventStream`.

## Performance Testing of the Different Large File Reading Strategies

`console.time` and `console.timeEnd` are used to determine the performance of the 3 different implementations, and which is most efficient processing of the input files.

### To Download the Really Large FEC File

The text file to be processed consists of records of politcal campaign contributions by individuals during the 2018 election cycle.

Download the large file zip here: https://www.fec.gov/files/bulk-downloads/2018/indiv18.zip

### To Download the Dictionary and Header Files 

The indiv18.zip contains files which are essentially in a comma separated values style. There are 21 fields. To make sense of them, you need to get additional files from the data_dictionaries folder. A "Documentation" folder is provided which contains the two files listed below. However, these files apply to the 2018 election data. If the file layouts have changed in subsequent election years, you will need to download the correct ones for the election cycle you are processing. Generally, you will want to  download from the Federal Election Commission "bulk downloads" site. The data_dictionaries folder should be checked for files named like the below. Download them if needed:

bulk-downloads/data_dictionaries/indiv_dictionary.txt

bulk-downloads/data_dictionaries/indiv_header_file.csv

dictionary.txt explains the data provided in each field of a contribution record. header_file.csv is formatted as a header record in comma separated values format, with one heading for each field provided in the contribution record.

The indiv18.zip file contains several files in the archive, some of which are quite large. The zip file alone can take 5+ minutes to download, depending on connection speed. 

The main file in the zip archive: `itcont.txt`, is the largest in size at 2.55 GiB. It can only be processed by the `readFileEventStream.js` script file. The other two scripts in this repository can't handle the input file size in memory. Node.js can only hold about 1.5GB in memory at one time.*

*Caveat: You can override the standard Node memory limit using the CLI arugment `max-old-space-size=XYZ`. To run, pass in `node --max-old-space-size=8192 <FILE NAME>.js` This will increase Node's memory limit to 8 GiB - just be careful not to make the value so large that Node kills off other processes or crashes because it runs out of memory.

### To Run
Before the first run, run `npm install` from the command line to install the `event-stream` and `performance.now` packages from Node. You may want to check the package.json file to adjust which versions of the external modules you are installing.

Add the file path for one of the files (could be the big one `itcont.txt` or any of its smaller siblings in the `indiv18` folder that were just downloaded), and type the command `node <FILE_NAME_TO_RUN>` in the command line.

Then you'll see the answers required from the file printed out to the terminal.

### To Check Performance Testing
Use one of the smaller files contained within the `indiv18` folder - they're all about 400MB and can be used with all 3 implementations. Run those along with the `console.time` and `performance.now()` references and you can see which solution is more performant and by how much.

### Option: Put FEC Contribution Records in a MongoDB v4.x Database Collection
It is possible to reformat the input records to a Javascript Object Notation (JSON) format compatible with MongoDB database version 4.x. You must do some additional preparation work. The instructions here assume you are familiar with the Linux command line and Linux-based utilities such as sed and egrep.

Download and unzip the indiv18.zip file. Download the header file noted above. Make note of the path where you unzipped the contribution files to.
The header file is in comma separated values format, using actual commas ',' as the separator. You must change the separator to a pipe symbol '|'.

`sed 's/\,/\|/g' < indiv_header_file.csv > test1.csv`

You must append individual contribution records to this test1.csv file. For testing purposes, use egrep to extract records of interest, such as contributors employed by particular companies.

`egrep 'PFIZER' itcont_2018_20181228_52010302.txt >> test1.csv`
    
Navigate to the database/mongodb_version4 folder.

Create a new folder named 'reformatted' in that folder.

On the command line, issue 

`node reformat_fec_data_to_json.js path/to/your/test1.csv`

The input file test1.csv is reformatted to json and the output file is in the reformatted/ folder that you created. It will have a *.json extension. You can change the name of the output file by changing the writeStream arguments in the reformat_fec_data_to_json.js script.

You can then import this reformatted data into a MongoDB version 4.x collection using the mongoimport utility, like so:

`mongoimport --db fecdata --collection t1 --file test1.json`

The advantage of loading this data into a MongoDB collection is that you can then perform aggregation queries on the collection using the db.collection.aggregate() utility of MongoDB.

Contributor @BobCochran has only tested the script with 1,563 input records. The script has not been thoroughly tested, in other words. To test the reformatting, Node.js version 10.16.3 was used. 


