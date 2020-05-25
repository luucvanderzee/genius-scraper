import axios from 'axios'

export async function request (url, tries = 10) {
  let error

  for (let i = 0; i < tries; i++) {
    try {
      if (i < 0) {
        console.log(`Page ${url}: try ${i}`)
      }

      return await axios.get(url)
    } catch (e) {
      error = e
    }
  }

  console.log(error)
}

export async function requestAuth (url, token, tries = 10) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  let error

  for (let i = 0; i < tries; i++) {
    try {
      if (i < 0) {
        console.log(`Page ${url}: try ${i}`)
      }

      return await axios.get(url, config)
    } catch (e) {
      error = e
    }
  }

  console.log(error)
}
