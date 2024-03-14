import { writeTable, readTable, removeTable, readTableSync } from "./util"
export const TableStatus = {
  pkMap: {},
  init: false
}
export function initTable() {}
export function selectFilesTable(name) {
  return {
    async save(key, data) {
      return writeTable(name + "/" + key, data)
    },
    async remove(key) {
      return removeTable(name + "/" + key)
    },
    async get(key) {
      try {
        return readTable(name + "/" + key)
      } catch (ex) {
        return null
      }
    },
    list() {}
  }
}
export class JsonDataTable {
  name = ""
  cache = null
  readTime = 0
  readPromise = null
  writeTime = 0
  writeTimmer = null
  writeDelay = 1000
  static tableInstance = {}
  static get(name) {
    if (tableInstance[name]) {
      return JsonDataTable.tableInstance[name]
    }
    return new JsonDataTable(name)
  }
  constructor(name) {
    if (JsonDataTable.tableInstance[name]) {
      return JsonDataTable.tableInstance[name]
    }
    this.name = name
    JsonDataTable.tableInstance[name] = this
    return this
  }
  async get() {
    if (!this.cache) {
      if (!this.readPromise) {
        this.readTime = +new Date()
        this.readPromise = readTableSync(this.name)
      }
      this.cache = this.readPromise
    }
    return this.cache
  }
  save(data) {
    this.cache = data
    if (this.writeTimmer) {
      clearTimeout(this.writeTimmer)
    }
    this.writeTimmer = setTimeout(() => {
      this.write(this.cache, data)
      this.writeTimmer = null
    }, this.writeDelay)
  }
  write(data) {
    this.writeTime = +new Date()
    return writeTable(this.name, data)
  }
  async merge(data) {
    this.cache = Object.assign(await this.get(), data)
    this.save(this.cache)
  }
  async add(data) {
    let list = await this.get()
    list.push(data)
    return this.save(list)
  }
  async delete(func) {
    let list = await this.get()
    let index = list.findIndex(func)
    if (index >= 0) {
      list.splice(index, 1)
    }
    return this.save(list)
  }
  async set(data) {
    return this.save(data)
  }
}
export function selectTable(name) {
  return {
    async get() {
      return await readTable(name)
    },
    save(data) {
      return writeTable(name, data)
    },
    async merge(data) {
      let oldData = await this.get()
      return writeTable(name, { ...oldData, ...data })
    },
    async add(data) {
      let list = await readTable(name, data)
      list.push(data)
      return writeTable(name, list)
    },
    async delete(func) {
      let list = await readTable(name)
      let index = list.findIndex(func)
      if (index >= 0) {
        list.splice(index, 1)
      }
      return writeTable(name, list)
    },
    async set(data) {
      return writeTable(name, data)
    }
  }
}