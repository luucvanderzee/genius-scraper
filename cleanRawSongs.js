import { readFileSync } from 'fs'
import { COLUMN_JOIN_STRING, ROW_JOIN_STRING } from './joinStrings.js'

function readCSV (path) {
  const rawString = readFileSync(path).toString()

  return rawString
    .split(ROW_JOIN_STRING)
    .map(strRow => strRow.split(COLUMN_JOIN_STRING))
}

function main () {
  const songsRaw = readCSV('./output/songsRaw.csv')

  console.log('Length:')
  console.log(songsRaw.length)
  console.log('Number of artists:')
  console.log(new Set(songsRaw.map(row => row[0])).size)
}

main()
