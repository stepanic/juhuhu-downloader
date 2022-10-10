# Juhuhu Downloader

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