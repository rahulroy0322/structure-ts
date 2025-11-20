import chalk from 'chalk'
import type { Db, Document, FindCursor, MongoClient } from 'mongodb'
import type { DatabaseAdapterType } from '../../../@types/database/adapters/main.types'
import type { MongoConfigType } from '../../../@types/database/config.types'
import type { OptionsModelType } from '../../../@types/model/options.types'
import type { SchemaType } from '../../../@types/model/utils.types'
import { MongoCompiler } from './compiler/mongo'

const getOptions = (
  result: FindCursor<Document>,
  { orderBy, limit, skip }: OptionsModelType<SchemaType> = {}
) => {
  if (orderBy && Object.keys(orderBy).length) {
    result = result.sort(
      Object.keys(orderBy).reduce(
        (acc, key) => {
          acc[key] = orderBy[key] === 'DESC' ? -1 : 1
          return acc
        },
        {} as Record<string, -1 | 1>
      )
    )
  }

  if (limit) {
    result = result.limit(limit)
    if (skip) {
      result = result.skip(skip)
    }
  }

  return result
}

const MongoAdapter = (
  config: Omit<MongoConfigType, 'engine'>
): DatabaseAdapterType => {
  let client: MongoClient | null = null
  let db: Db | null = null

  const compiler = MongoCompiler()

  const connect: DatabaseAdapterType['connect'] = async () => {
    if (db) {
      return
    }
    try {
      const { MongoClient } = await import('mongodb')

      client = new MongoClient(config.uri, {
        maxPoolSize: 10,
      })

      await client.connect()
      db = client.db(config.db)
    } catch (e) {
      if ((e as Error).message.startsWith("Cannot find module 'mongodb'")) {
        // biome-ignore lint/suspicious/noConsole: let user know
        console.log(chalk.redBright`please install "mongodb" first to use`)
      } else {
        console.error(chalk.blue(e))
      }
      process.exit(1)
    }
  }

  const disconnect: DatabaseAdapterType['disconnect'] = async () => {
    if (client) {
      await client.close()
    }
    client = null
    db = null
  }

  const getCollection = (table: string) => {
    if (!db) {
      // TODO! proper error!
      throw new Error('please connect db first')
    }

    return db.collection(table)
  }

  const find: DatabaseAdapterType['find'] = async (
    table,
    filter,
    projection = {},
    options
  ) => {
    const collection = getCollection(table)

    let result = collection.find(compiler.filter(filter) as any)

    if (Object.keys(projection)) {
      projection = {
        ...projection,
        _id: true,
      }
      result = result.project(projection)
    }

    if (options) {
      ;(result as any) = getOptions(result, options)
    }

    return (await result.toArray()).map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
    })) as any
  }

  const create: DatabaseAdapterType['create'] = async (
    table,
    data,
    projection = {}
  ) => {
    const collection = getCollection(table)

    const insert = await collection.insertMany(data as any)

    return await find(
      table,
      {
        _id: {
          in: Object.values(insert.insertedIds),
        },
      } as any,
      projection
    )
  }

  const update: DatabaseAdapterType['update'] = async (
    table,
    filter,
    data,
    projection,
    options
  ) => {
    const { ObjectId } = await import('mongodb')
    const collection = getCollection(table)

    const docs = await find(table, filter, projection, options)

    const ids = docs.map(({ _id }) => new ObjectId(_id))

    await collection.updateMany(
      compiler.filter({
        _id: {
          in: ids,
        },
      } as any) as any,
      {
        $set: data,
      }
    )

    return docs.map((doc) => {
      let newDoc = {
        ...doc,
        ...data,
      }

      if (projection && Object.keys(projection).length) {
        const _newDoc = {} as Partial<typeof newDoc>
        for (const key in projection) {
          if (projection[key]) {
            _newDoc[key] = newDoc[key]
          }
        }
        _newDoc._id = newDoc._id

        ;(newDoc as Partial<typeof newDoc>) = _newDoc
      }

      newDoc

      return newDoc
    }) as any
  }

  const destroy: DatabaseAdapterType['destroy'] = async (
    table,
    filter,
    options
  ) => {
    const { ObjectId } = await import('mongodb')
    const collection = getCollection(table)

    const docs = await find(table, filter, undefined, options)

    const ids = docs.map(({ _id }) => new ObjectId(_id))

    await collection.deleteMany(
      compiler.filter({
        _id: {
          in: ids,
        },
      } as any) as any
    )

    return docs as any
  }

  const raw = () => db

  return {
    connect,
    disconnect,
    create,
    update,
    destroy,
    find,
    raw,
  }
}

export { MongoAdapter }
