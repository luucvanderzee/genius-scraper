import { readFileSync } from 'fs'
import { COLUMN_JOIN_STRING, ROW_JOIN_STRING } from './joinStrings.js'
import { getRawLines, processRawLines } from './utils/cleaning.js'
// import { createTable } from './db'

function readCSV (path) {
  const rawString = readFileSync(path).toString()

  return rawString
    .split(ROW_JOIN_STRING)
    .map(strRow => strRow.split(COLUMN_JOIN_STRING))
}

function log (array) {
  const len = array.length
  const numberOfCycles = ((len - (len % 100)) / 100) + 1

  for (let i = 0; i < numberOfCycles; i++) {
    console.log(array.slice((i * 100), (i + 1) * 100))
  }

  console.log('-----------')
}

function cleanPage (htmlStr) {
  console.log(htmlStr)
  const rawLines = getRawLines(htmlStr)
  // log(rawLines)

  const processedLines = processRawLines(rawLines)

  // return processedLines.join('\n')
}

function cleanLocationDate (locationDateStr) {
  return locationDateStr.split('---')
}

async function main () {
  // const db = await createTable('songs', ['artist', 'url', 'lyrics', 'location', 'date'])
  const songsRaw = readCSV('./output/songsRaw.csv')
  let currentPercentage = '0%'

  // for (let i = 608; i < 609; i++) {
  for (let i = 0; i < songsRaw.length; i++) {
    const [artist, url, rawText, rawLocationDate] = songsRaw[i]

    if (url !== 'https://genius.com/Public-enemy-she-watch-channel-zero-lyrics') {
      continue
    }

    // const lyrics = cleanPage(rawText)
    console.log(i)
    throw new Error('CHEEKY BREEKY')
    // const [location, date] = cleanLocationDate(rawLocationDate)

    // await db.insert({
    //   artist,
    //   url,
    //   lyrics,
    //   location,
    //   date
    // })

    // const percentage = `${Math.round(((i + 1) / (songsRaw.length + 1)) * 100)}%`

    // if (currentPercentage !== percentage) {
    //   currentPercentage = percentage
    //   console.log(currentPercentage)
    // }
  }
}

main()
