import { readFileSync, writeFileSync } from 'fs'
import { createCache } from './cache'
import { requestAuth } from './utils/request.js'
require('dotenv').config()

const ACCESS_TOKEN = process.env.GENIUS_API_TOKEN

const songURLCache = createCache('songURLs')

async function getSongs (artist) {
  const searchURL = `https://api.genius.com/search?q=${artist}&per_page=20`
  const response = await requestPage(searchURL, songURLCache)

  const hits = response.response.hits.filter(hit => {
    return hit.result.primary_artist.name.toLowerCase() === artist.toLowerCase()
  })

  return getSongData(hits, artist)
}

async function requestPage (url, cache) {
  const cacheHasURL = await cache.has(url)

  if (cacheHasURL) {
    return await cache.get(url)
  }

  if (!cacheHasURL) {
    const requestObject = await requestAuth(url, ACCESS_TOKEN)
    const html = requestObject.data

    await cache.set(url, html)

    return html
  }
}

function getSongData (hits, artist) {
  const songData = []

  hits.forEach(hit => {
    songData.push([
      artist,
      hit.result.url
    ])
  })

  return songData
}

let songData = []

async function main () {
  const artists = readFileSync('./output/artists-cleaned.txt').toString().split('---')

  for (const artist of artists) {
    const songsByArtist = await getSongs(artist)
    songData = songData.concat(songsByArtist)
    console.log(`Collected ${songsByArtist.length} songs by ${artist}`)
  }

  writeFileSync('./output/songURLs.csv', songData.map(song => song.join('---')).join('\n'))
}

main()
