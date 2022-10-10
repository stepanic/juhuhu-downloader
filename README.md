# Juhuhu Downloader

Simple downloader which takes the array of streams with defined duration and number of sub-streams and make an offline version of Juhuhu videos.

It uses an example of Paw Patrol series https://juhuhu.hrt.hr/emisija/96/psici-u-ophodnji without ads on the start and on ont end of each video file and excludes the streams which have any dragon :))

All video chunks are after download squashed to the one file with FFMPEG.

## How to use it

1. open any stream at https://juhuhu.hrt.hr/
2. play a stream
3. with a browser console at a `Network` tab clear everything
4. jump to the end of the video stream
5. copy the URL of the latest stream chunk in format `https://streaming.hrt.hr/webstream/smil:<STREAM_ID>.smil/media_b2896000_<NUMBER_OF_CHUNKS + 1>.ts`

## Optionally  

- trim the video on start and on the end if your stream has any ads on it :))

## Nice to have

- Waiting for you PR :))

- just paste URL of the TV series and scrapper would do everything for you listed above :))
    - check `https://streaming.hrt.hr/webstream/smil:<STREAM_ID>.smil/chunklist_b2896000.m3u`
    - using of https://www.npmjs.com/package/nodejs-web-scraper would be nice

- wrap the script to the Electron Desktop app