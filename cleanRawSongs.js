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

const isTextNode = node => node.nodeType === 3
const isAnchorNode = node => node.nodeType === 1 && node.tagName.toLowerCase() === 'a'

function cleanPage (htmlStr) {
  const dom = new JSDOM(`<!DOCTYPE html>${htmlStr}`).window.document
  const rootNodes = dom.querySelector('body').childNodes

  const lines = []

  rootNodes.forEach(node => {
    if (isTextNode(node) || isAnchorNode(node)) {
      const linesInNode = cleanNode(node)

      if (linesInNode) {
        lines.push(...linesInNode)
      }
    }
  })

  return lines.join('\n')
}

function cleanNode (node) {
  const trimmed = node.textContent.trim().split('"').join('')
  if (trimmed.length === 0) return null

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return null
  }

  if (textContainsMultipleLines(trimmed)) {
    return extractLines(trimmed)
  } else {
    return [trimmed]
  }
}

function textContainsMultipleLines (text) {
  return text.match(/[a-z|\d|[.!?'][A-Z][a-zA-Z\s]/)
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

const regex = /[a-z|\d|[.!?'][A-Z][a-zA-Z\s]/g

function getIndices (text) {
  const matches = text.matchAll(regex)
  const indices = []

  for (const match of matches) {
    indices.push(match.index + 1)
  }

  return indices
}

function cleanLocationDate (locationDateStr) {
  return locationDateStr.split('---')
}

async function main () {
  const db = await createTable('songs', ['artist', 'url', 'lyrics', 'location', 'date'])
  const songsRaw = readCSV('./output/songsRaw.csv')
  let currentPercentage = '0%'

  for (let i = 0; i < songsRaw.length; i++) {
    const [artist, url, rawText, rawLocationDate] = songsRaw[i]
    const lyrics = cleanPage(rawText)
    const [location, date] = cleanLocationDate(rawLocationDate)

    await db.insert({
      artist,
      url,
      lyrics,
      location,
      date
    })

    const percentage = `${Math.round(((i + 1) / (songsRaw.length + 1)) * 100)}%`

    if (currentPercentage !== percentage) {
      currentPercentage = percentage
      console.log(currentPercentage)
    }
  }
}

main()
