import { JSDOM } from 'jsdom'

const isTextNode = node => node.nodeType === 3
const isAnchorNode = node => node.nodeType === 1 && node.tagName.toLowerCase() === 'a'

export function getRawLines (htmlStr) {
  const dom = new JSDOM(`<!DOCTYPE html>${htmlStr}`).window.document
  const rootNodes = dom.querySelector('body').childNodes

  const rawLines = []

  rootNodes.forEach(node => {
    if (isTextNode(node) || isAnchorNode(node)) {
      const linesInNode = cleanNode(node)
      rawLines.push(...linesInNode.filter(line => line !== '\''))
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

const matchRegex = /[a-z|\d|\].!?'][A-Z][a-zA-Z\s']/

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

const matchAllRegex = /[a-z|\d|\].!?'][A-Z][a-zA-Z\s']/g

function getIndices (text) {
  const matches = text.matchAll(matchAllRegex)
  const indices = []

  for (const match of matches) {
    indices.push(match.index + 1)
  }

  return indices
}

export function processRawLines (rawLines) {
  const processedLines = []

  const songSections = {}
  let lastLine = ''
  let currentSongSection = ''
  let recordedLines = []

  rawLines.forEach(line => {
    const lastLineWasSongSectionIndicator = isSongSectionIndicator(lastLine)
    const currentLineIsSongSectionIndicator = isSongSectionIndicator(line)

    if (lastLineWasSongSectionIndicator && currentLineIsSongSectionIndicator) {
      if (songSections[lastLine] && isChorusOrHook(lastLine)) {
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
      if (isChorusOrHook(currentSongSection)) {
        recordedLines.push(line)
      }

      processedLines.push(line)
    }

    lastLine = line
  })

  return processedLines
}

function isSongSectionIndicator (line) {
  return line.startsWith('[') && line.endsWith(']')
}

function isChorusOrHook (songSection) {
  const lower = songSection.toLowerCase()
  return (
    lower.startsWith('[chorus') ||
    lower.startsWith('[hook') ||
    lower.startsWith('[refrain')
  )
}
