import levelup from 'levelup'
import leveldown from 'leveldown'

export function createCache (name) {
  const db = levelup(leveldown(`./cache/${name}`))

  async function has (key) {
    try {
      await db.get(key)
      return true
    } catch (error) {
      if (error.notFound) return false

      throw error
    }
  }

  async function get (key) {
    if (!(await has(key))) {
      throw new Error(`key "${key} not found`)
    }

    const stringifiedValue = await db.get(key, { asBuffer: false })
    return JSON.parse(stringifiedValue)
  }

  async function set (key, value) {
    if (await has(key)) {
      throw new Error(`key "${key}" already in cache`)
    }

    const stringifiedValue = JSON.stringify(value)
    await db.put(key, stringifiedValue)
  }

  return {
    has,
    get,
    set
  }
}
