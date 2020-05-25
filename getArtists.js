import { writeFileSync } from 'fs'
import { createCache } from './cache'
import { request } from './utils/request.js'
import { JSDOM } from 'jsdom'

const cache = createCache('artists')

function getURL (page) {
  return `https://www.last.fm/tag/hip-hop/artists?page=${page}`
}

async function requestPage (url) {
  const cacheHasURL = await cache.has(url)

  if (cacheHasURL) {
    return await cache.get(url)
  }

  if (!cacheHasURL) {
    const requestObject = await request(url)
    const html = requestObject.data

    await cache.set(url, html)

    return html
  }
}

function getArtists (page) {
  const dom = new JSDOM(page).window.document
  const artists = []

  dom.querySelectorAll('a.link-block-target').forEach(a => {
    artists.push(a.textContent.trim())
  })

  return artists
}

const NUMBER_OF_PAGES = 48
let artists = []

async function main () {
  for (let i = 1; i <= NUMBER_OF_PAGES; i++) {
    const pageURL = getURL(i)
    const page = await requestPage(pageURL)

    artists = artists.concat(getArtists(page))
    console.log(`Page ${i} done!`)
  }

  writeFileSync('./output/artists.txt', artists.join('---'))
  console.log('All done!')
}

main()
