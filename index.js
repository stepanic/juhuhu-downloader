const Downloader = require("nodejs-file-downloader");
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffprobeInstaller = require('@ffprobe-installer/ffprobe');
const ffmpeg = require('fluent-ffmpeg');

const DIRECTORY = `./downloads/juhuhu/psici-u-ophodnji`;
const REMOVE_SECONDS_FROM_START = 4;
const REMOVE_SECONDS_FROM_END = 3;

const STREAMS = [
    // { id: 'VCHMEdDvjkTnAXah', videos: 20, sid: '001', duration: 205, title: 'Filmska večer', },
    { id: 'gYtGrvKbVgP8zKyh', videos: 22, sid: '002', duration: 225, title: 'Vulkanska erupcija' },
    { id: '23Bw8fZU52HbcJCq', videos: 17, sid: '003', duration: 178, title: 'Ukrasna ploča' },
    { id: 'YYmvwemJcMbzgUjb', videos: 21, sid: '004', duration: 211, title: 'Kralj pauka' },
    { id: 'FSFKNVpdzYxv9GG4', videos: 20, sid: '005', duration: 202, title: 'Majmonaut' },
    { id: 'Bgg3HNu5Ppbz9uNj', videos: 19, sid: '006', duration: 200, title: 'Spašavanje mladunca' },
    { id: '34nKgq9a8r6x6Q3W', videos: 18, sid: '007', duration: 184, title: 'Psići spašavaju ponija' },
    { id: 'MFA6SREu3wMcaQDj', videos: 22, sid: '008', duration: 222, title: 'Kraljica majmuna' },
    { id: 'WFnP5tcmaxabErnb', videos: 22, sid: '009', duration: 227, title: 'Ptičice' },
    { id: 'qytmxBHdcBx2vTHw', videos: 21, sid: '010', duration: 214, title: 'Robo pas' },
    { id: 'JCB5kTg3exmNHQvV', videos: 22, sid: '011', duration: 227, title: 'Slomljeno krilo' },
    // { id: 'ybWpftfxdnYz37ye', videos: 18, sid: '012', duration: 183, title: 'Zmaj' },
    { id: 'A4yU2FzE2fH9H9bu', videos: 18, sid: '013', duration: 187, title: 'Opasnost mi je srednje ime' },
    { id: '2bqEG9guyAGsJGCC', videos: 16, sid: '014', duration: 165, title: 'Problem s balončićem' },
    { id: 'jtPNytdHtHKDKdDP', videos: 22, sid: '015', duration: 227, title: 'Poklon' },
];


// Filmska vecer 03:25
// https://streaming.hrt.hr/webstream/smil:VCHMEdDvjkTnAXah.smil/media_b2896000_20.ts

// Vulkanska erupcija 03:45
// https://streaming.hrt.hr/webstream/smil:gYtGrvKbVgP8zKyh.smil/media_b2896000_22.ts

// Ukrasna ploca 02:58
// https://streaming.hrt.hr/webstream/smil:23Bw8fZU52HbcJCq.smil/media_b2896000_17.ts

// Kralj pauka 03:31
// https://streaming.hrt.hr/webstream/smil:YYmvwemJcMbzgUjb.smil/media_b2896000_21.ts

// Majmonaut 03:22
// https://streaming.hrt.hr/webstream/smil:FSFKNVpdzYxv9GG4.smil/media_b2896000_20.ts

// Spasavanje mladunca 03:20
// https://streaming.hrt.hr/webstream/smil:Bgg3HNu5Ppbz9uNj.smil/media_b2896000_19.ts

// Psici spasavaju ponija 03:04
// https://streaming.hrt.hr/webstream/smil:34nKgq9a8r6x6Q3W.smil/media_b2896000_18.ts

// Kraljica majmuna 03:42
// https://streaming.hrt.hr/webstream/smil:MFA6SREu3wMcaQDj.smil/media_b2896000_22.ts

// Pticice 03:47
// https://streaming.hrt.hr/webstream/smil:WFnP5tcmaxabErnb.smil/media_b2896000_22.ts

// Robo pas 03:34
// https://streaming.hrt.hr/webstream/smil:qytmxBHdcBx2vTHw.smil/media_b2896000_21.ts

// Slomljeno krilo 03:47
// https://streaming.hrt.hr/webstream/smil:JCB5kTg3exmNHQvV.smil/media_b2896000_22.ts

// Zmaj 03:03
// https://streaming.hrt.hr/webstream/smil:ybWpftfxdnYz37ye.smil/media_b2896000_18.ts

// Opasnost mi je srednje ime 03:07
// https://streaming.hrt.hr/webstream/smil:A4yU2FzE2fH9H9bu.smil/media_b2896000_18.ts

// Problem s baloncicem 02:45
// https://streaming.hrt.hr/webstream/smil:2bqEG9guyAGsJGCC.smil/media_b2896000_16.ts
 
// Poklon 03:47
// https://streaming.hrt.hr/webstream/smil:jtPNytdHtHKDKdDP.smil/media_b2896000_22.ts

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