# Node.js Large File / Data Reading & Performance Testing


# Doing this on Windows

Apparently NodeJs on Windows has a limit on file size, at least with `fs.readFile`. 
So we just make the file a bit smaller.
 
This requires Unix tools, which you can get via Ubuntu-on-Windows or Cygwin or (in my case)
simply git-bash.

    $ wc -l itcont.txt
    19363450 itcont.txt

    $ head -n 10000000 itcont.txt > cont-10m.txt

    $ head -n 10000000 itcont.txt > cont-10m.txt

I also added a command line arg for easier running in the terminal:

    node .\readFile.js .\data\cont-1m.txt 


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



