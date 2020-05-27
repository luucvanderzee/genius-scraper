import { readFileSync } from 'fs'
import { COLUMN_JOIN_STRING, ROW_JOIN_STRING } from './joinStrings.js'
import { JSDOM } from 'jsdom'
import { createTable } from './db'

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
  log(rawLines)

  const processedLines = processRawLines(rawLines)

  return processedLines.join('\n')
}

const isTextNode = node => node.nodeType === 3
const isAnchorNode = node => node.nodeType === 1 && node.tagName.toLowerCase() === 'a'

export function getRawLines (htmlStr) {
  const dom = new JSDOM(`<!DOCTYPE html>${htmlStr}`).window.document
  const rootNodes = dom.querySelector('body').childNodes

  const rawLines = []

  rootNodes.forEach(node => {
    if (isTextNode(node) || isAnchorNode(node)) {
      const linesInNode = cleanNode(node)
      rawLines.push(...linesInNode)
    }
  })

  return rawLines
}

function cleanNode (node) {
  const trimmed = node.textContent.trim().split('"').join('')
  if (trimmed.length === 0) return []

  if (textContainsMultipleLines(trimmed)) {
    return extractLines(trimmed)
  } else {
    return [trimmed]
  }
}

const matchRegex = /[a-z|\d|\].!?'][A-Z][a-zA-Z\s]/

function textContainsMultipleLines (text) {
  return text.match(matchRegex)
}

function extractLines (text) {
  const newLineIndices = getIndices(text)
  const lines = [text.slice(0, newLineIndices[0])]

  for (let i = 1; i < newLineIndices.length; i++) {
    lines.push(text.slice(newLineIndices[i - 1], newLineIndices[i]))
  }

  lines.push(text.slice(newLineIndices[newLineIndices.length - 1], text.length))

  return lines
}

const matchAllRegex = /[a-z|\d|\].!?'][A-Z][a-zA-Z\s]/g

function getIndices (text) {
  const matches = text.matchAll(matchAllRegex)
  const indices = []

  for (const match of matches) {
    indices.push(match.index + 1)
  }

  return indices
}

function processRawLines (rawLines) {
  const processedLines = []

  const songSections = {}
  let lastLine = ''
  let currentSongSection = ''
  let recordedLines = []

  rawLines.forEach(line => {
    const lastLineWasSongSectionIndicator = isSongSectionIndicator(lastLine)
    const currentLineIsSongSectionIndicator = isSongSectionIndicator(line)

    if (lastLineWasSongSectionIndicator && currentLineIsSongSectionIndicator) {
      if (songSections[lastLine]) {
        processedLines.push(...songSections[lastLine])
      }

      recordedLines = []
      currentSongSection = line
    }

    if (!lastLineWasSongSectionIndicator && currentLineIsSongSectionIndicator) {
      songSections[currentSongSection] = recordedLines
      recordedLines = []
      currentSongSection = line
    }

    if (!currentLineIsSongSectionIndicator) {
      recordedLines.push(line)
      processedLines.push(line)
    }

    lastLine = line
  })

  return processedLines
}

function isSongSectionIndicator (line) {
  return line.startsWith('[') && line.endsWith(']')
}

function cleanLocationDate (locationDateStr) {
  return locationDateStr.split('---')
}

async function main () {
  // const db = await createTable('songs', ['artist', 'url', 'lyrics', 'location', 'date'])
  const songsRaw = readCSV('./output/songsRaw.csv')
  let currentPercentage = '0%'

  for (let i = 0; i < 1; i++) {
  // for (let i = 0; i < songsRaw.length; i++) {
    const [artist, url, rawText, rawLocationDate] = songsRaw[i]
    const lyrics = cleanPage(rawText)
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
