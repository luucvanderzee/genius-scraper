import { readFileSync } from 'fs'
import { COLUMN_JOIN_STRING, ROW_JOIN_STRING } from './joinStrings.js'
import { getRawLines, processRawLines } from './utils/cleaning.js'
import { createTable } from './db'

function readCSV (path) {
  const rawString = readFileSync(path).toString()

  return rawString
    .split(ROW_JOIN_STRING)
    .map(strRow => strRow.split(COLUMN_JOIN_STRING))
}

function cleanPage (htmlStr) {
  const rawLines = getRawLines(htmlStr)
  const processedLines = processRawLines(rawLines)

  return processedLines.join('\n')
}

const yearRegex = /\d{4}$/

function cleanDate (locationDateStr) {
  const split = locationDateStr.split('---')

  const split0Match = split[0].match(yearRegex)
  if (split0Match) return split0Match[0]

  const split1Match = split[1] ? split[1].match(yearRegex) : undefined
  if (split1Match !== undefined) return split1Match[0]
}

async function main () {
  const db = await createTable('songs', ['artist', 'url', 'lyrics', 'date'])
  const songsRaw = readCSV('./output/songsRaw.csv')
  let currentPercentage = '0%'

  for (let i = 0; i < songsRaw.length; i++) {
    const [artist, url, rawText, rawLocationDate] = songsRaw[i]

    const lyrics = cleanPage(rawText)
    const date = cleanDate(rawLocationDate)

    if (date) {
      await db.insert({
        artist,
        url,
        lyrics,
        date
      })
    }

    const percentage = `${Math.round(((i + 1) / (songsRaw.length + 1)) * 100)}%`

    if (currentPercentage !== percentage) {
      currentPercentage = percentage
      console.log(currentPercentage)
    }
  }
}

main()
