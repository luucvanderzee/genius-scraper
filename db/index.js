import _knex from 'knex'

const knex = _knex({
  client: 'sqlite3',
  connection: {
    filename: './db/data.db'
  },
  useNullAsDefault: true
})

export async function createTable (name, columns) {
  const tableAlreadyExists = await tableExists(name)

  if (tableAlreadyExists) {
    throw new Error(`Table "${name}" already exists`)
  }

  await knex.schema.createTable(name, table => {
    table.increments('id')

    columns.forEach(columnName => {
      table.string(columnName)
    })
  })

  return {
    insert: async rows => knex(name).insert(rows)
  }
}

export async function tableExists (name) {
  return await knex.schema.hasTable(name)
}

export function getTable (name) {
  const table = knex(name)
  return table
}

export async function tableLength (name) {
  const queryResult = await knex(name).count('id')
  return queryResult[0]['count(`id`)']
}
