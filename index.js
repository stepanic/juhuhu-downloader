const Downloader = require("nodejs-file-downloader");
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffprobeInstaller = require('@ffprobe-installer/ffprobe');
const ffmpeg = require('fluent-ffmpeg');

const DIRECTORY = `./downloads/juhuhu/psici-u-ophodnji`;
const REMOVE_SECONDS_FROM_START = 4;
const REMOVE_SECONDS_FROM_END = 3;

const STREAMS = require('./config/pjesmice.js').STREAMS;

function printProgress(text) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(text);
}

const download = async () => {
  for (let i = 0; i < STREAMS.length; i++) {
      const stream = STREAMS[i];
      for (let j = 0; j <= stream.videos; j++) {
          const url = `https://streaming.hrt.hr/webstream/smil:${stream.id}.smil/media_b2896000_${j}.ts`;
          const downloader = new Downloader({
              url: url,
              directory: DIRECTORY,
              fileName: `${stream.sid} - ${stream.title} - ${j}.ts`,
              cloneFiles: false,
              onProgress: function (percentage, chunk, remainingSize) {
                const title = `${i + 1}/${STREAMS.length} - ${j}/${stream.videos} - ${stream.sid} - ${stream.title} - ${j}.ts`;
                printProgress(`${title} ${percentage}%`);
              },
          });
          await downloader.download();
      }
  }
};

const mergeSingleTsFile = () => {
  return new Promise((resolve, reject) => {
    
    const directory = DIRECTORY;
    
    const mergedFilePaths = [];
    
    let waitingPromises = 0;
    
    for (let i = 0; i < STREAMS.length; i++) {
      const filePaths = [];
      
      // Just for a faster development
      // if (i === 3) {
      //   break;
      // }
      
      const stream = STREAMS[i];
      for (let j = 0; j <= stream.videos; j++) {
        const fileName = `${process.cwd()}/${directory}/${stream.sid} - ${stream.title} - ${j}.ts`;
        filePaths.push(fileName);
      }
      
      const mergedFilePath = `${process.cwd()}/${directory}/${stream.sid} - ${stream.title}.ts`;
      mergedFilePaths.push(mergedFilePath);
      
      waitingPromises++;
      
      ffmpeg()
        .input(`concat:${filePaths.join('|')}`)
        .setStartTime(REMOVE_SECONDS_FROM_START) // remove adds from the beginning
        .setDuration(stream.duration - REMOVE_SECONDS_FROM_START - REMOVE_SECONDS_FROM_END) // remove adds from the end
        .audioCodec('copy')
        .videoCodec('copy')
        .on('error', function(err) {
          console.log('An error occurred: ' + err.message);
          reject(err);
        })
        .on('end', function() {
          console.log('Merging finished: ' + mergedFilePath);
          
          waitingPromises--;
          
          if (waitingPromises === 0) {
            
            ffmpeg()
              .input(`concat:${mergedFilePaths.join('|')}`)
              .audioCodec('copy')
              .videoCodec('copy')
              .on('error', function(err) {
                console.log('An error occurred: ' + err.message);
                reject(err);
              })
              .on('end', function() {
                console.log('Merging finished final: ' + `${directory}.ts`);
                resolve();
              })
              .save(`${process.cwd()}/${directory}.ts`);
            
          }
        })
        .save(mergedFilePath);
    }
  })
}

const run = async () => {
  ffmpeg.setFfmpegPath(ffmpegInstaller.path);
  ffmpeg.setFfprobePath(ffprobeInstaller.path);
  
  await download();
  await mergeSingleTsFile();
  
  console.log('DONE');
};

run();