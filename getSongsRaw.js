import { readFileSync, writeFileSync } from 'fs'
import puppeteer from 'puppeteer'
import { createCache } from './cache'
import { COLUMN_JOIN_STRING, ROW_JOIN_STRING } from './joinStrings.js'

const cache = createCache('songsRaw')

function readCSV (path) {
  const rawString = readFileSync(path).toString()

  return rawString.split('\n').map(strRow => strRow.split('---'))
}

const TRIES = 5

async function grabLyricsAndDate (page) {
  for (let i = 0; i < TRIES; i++) {
    try {
      await page.waitForSelector('div.lyrics', { timeout: 0 })

      return await page.evaluate(() => {
        const lyricsDiv = document.querySelector('div.lyrics')
        const paragraph = lyricsDiv.querySelector('p')
        const lyrics = paragraph.innerHTML

        const locationAndDateElements = document.querySelectorAll('span.metadata_unit-info.metadata_unit-info--text_only')
        const locationAndDate = []

        locationAndDateElements.forEach(element => {
          locationAndDate.push(element.innerText)
        })

        return { lyrics, locationAndDate: locationAndDate.join('---') }
      })
    } catch (e) {
      if (i === (TRIES - 1)) {
        console.log(e)
        return null
      } else {
        console.log(`Try ${i + 2}...`)
      }
    }
  }
}

const data = []

async function main () {
  const songs = readCSV('./output/songURLs.csv')

  // const browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'] })
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({ width: 1920, height: 1080 })

  for (const [artist, url] of songs) {
    const cacheHasURL = await cache.has(url)
    let lyricsAndDate

    if (cacheHasURL) {
      lyricsAndDate = await cache.get(url)
    }

    if (!cacheHasURL) {
      await page.goto(url, { timeout: 0 })
      lyricsAndDate = await grabLyricsAndDate(page)

      if (lyricsAndDate) {
        await cache.set(url, lyricsAndDate)
      }
    }

    if (lyricsAndDate) {
      data.push([
        artist,
        url,
        lyricsAndDate.lyrics,
        lyricsAndDate.locationAndDate
      ])

      console.log(`Just finished ${url} (${Math.round((data.length / songs.length) * 100)}%)`)
    } else {
      console.log(`Skipped ${url}`)
    }
  }

  writeFileSync('./output/songsRaw.csv', data.map(song => song.join(COLUMN_JOIN_STRING)).join(ROW_JOIN_STRING))

  await browser.close()
}

main()
