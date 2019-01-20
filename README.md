# Node.js Large File / Data Reading & Performance Testing

Main difference of my solution compared to the original:
 - zero external dependencies! NodeJs has its own perf.now() and doesn't need an NPM package for that.

 - aggregation is done on reading, so that the used memory is only proportional to the
   number of different first names in the file, and not proportional to the total number
   of records in the file. That's 67k vs 19m. (Additionally just a name and a count is
   less data than the entire record/line.)
   This difference is actually the biggest and makes it a real streaming solution.
   (I didn't implement the counts on dates, but those are 100% analogous.)
   
 - timing is done correctly separating the time of our code in the loop versus the remaining
   time used by NodeJs and the system in between calling our code with fresh data.
   
 - regex for extracting names; hat-tip to [Stuart Marks](https://stuartmarks.wordpress.com/2019/01/11/processing-large-files-in-java/) This actually saves about 10% more 
   running time (when running the program with a hot cache, that is for the second time
   in a row, see below)
 
 - instead of sorting the names by their count, I just get the maximum with an iteration.
   I haven't measured if that has an actual perf-benefit, because I didn't implement the
   sorting variant in my code.

To run the new thing:

    cd pure
    node --max-old-space-size=300 .\readline-stream.js ..\data\itcont.txt
    

# Doing this on Windows

Apparently NodeJs on Windows has a limit on file size, at least with `fs.readFile`. 
So we just make the file a bit smaller. Note: my solution doesn't require this!
It runs even with the largest file and uses less than 100 MB of memory.

Ironically, on my Laptop with 24G of RAM, even the EventStream solution crashes, 
thus not faring better than Paige's readline-variant. 
 
This requires Unix tools, which you can get via Ubuntu-on-Windows or Cygwin or (in my case)
simply git-bash.

    $ wc -l itcont.txt
    19363450 itcont.txt

    $ head -n 10000000 itcont.txt > cont-10m.txt

    $ head -n 10000000 itcont.txt > cont-10m.txt

I also added a command line arg for easier running in the terminal:

    node .\readFile.js .\data\cont-1m.txt 

# my stats

`readFile.js` works with 1m lines and can also read 5m lines, but crashes when processing 
the data in a subsequent step.

variants to time:
 - firstName old and with regex
 - only most common name or top 10
 
Without extracting first name:

    PS C:\Users\Jack\s\nodejs-streaming\pure> node --max-old-space-size=300 .\readline-stream.js ..\data\itcont.txt
    Total time for reading and processing file: 93,200ms.
    Thereof time spent in custom processing code: 64,110ms.
    Dataset has 19,363,450 entries.
    2,014,102 different names found in file.
    The most common name is 'BARLOW, SIBYLLE' with 19,505 occurrences.    

And when run for a second time:

    Total time for reading and processing file: 88,610ms.
    Thereof time spent in custom processing code: 61,180ms.

Old extraction of first name:

    Total time for reading and processing file: 107,800ms.
    Thereof time spent in custom processing code: 77,790ms.
    Dataset has 19,363,450 entries.
    67,258 different names found in file.
    The most common name is 'JOHN' with 503086 occurrences.
    
But when run for a second time:

    Total time for reading and processing file: 56,100ms.
    Thereof time spent in custom processing code: 37,420ms.

Regex extraction of first name:

    Total time for reading and processing file: 89,830ms.
    Thereof time spent in custom processing code: 61,020ms.
    Dataset has 19,363,450 entries.
    67,258 different names found in file.
    The most common name is 'JOHN' with 503,064 occurrences.

But when we run it just briefly afterwards:

    Total time for reading and processing file: 49,970ms.
    Thereof time spent in custom processing code: 31,560ms.


# designing a new solution

https://nodejs.org/api/readline.html#readline_example_read_file_stream_line_by_line
--> async API is not in LTS yet, so it might change in the future
(I don't work with NodeJs much, so I only use LTS which is guaranteed to work also next year
and beyond.)

https://nodejs.org/dist/latest-v10.x/docs/api/readline.html

First insight: `readline` does not have the file size limit of `fs.readFile`!

# Content of forked Readme.md below

This is an example of 3 different ways to use Node.js to process big data files. 
One file is the Node.js' `fs.readFile()`, another is with Node.js' `fs.createReadSteam()`, 
and the final is with the help of the NPM module `EventStream`.

There is also use of `console.time` and `console.timeEnd` to determine the performance 
of the 3 different implementations, and which is most efficient processing the files.

### To Download the Really Large File
Download the large file zip here: https://www.fec.gov/files/bulk-downloads/2018/indiv18.zip

The main file in the zip: `itcont.txt`, can only be processed by the `readFileEventStream.js` file, 
the other two implementations can't handle the 2.55GB file size in memory (Node.js can only hold 
about 1.5GB in memory at one time).*

*Caveat: You can override the standard Node memory limit using the CLI arugment `max-old-space-size=XYZ`. 
To run, pass in `node --max-old-space-size=8192 <FILE NAME>.js` (this will increase Node's memory limit 
to 8gb - just be careful not to make it too large that Node kills off other processes or crashes because 
its run out of memory)

### To Run
Before the first run, run `npm install` from the command line to install the `event-stream` and 
`performance.now` packages from Node.

Add the file path for one of the files (could be the big one `itcont.txt` or any of its smaller 
siblings in the `indiv18` folder that were just downloaded), and type the command `node <FILE_NAME_TO_RUN>` 
in the command line.

Then you'll see the answers required from the file printed out to the terminal.

### To Check Performance Testing
Use one of the smaller files contained within the `indiv18` folder - they're all about 400MB and can be 
used with all 3 implementations. Run those along with the `console.time` and `performance.now()` references 
and you can see which solution is more performant and by how much.



