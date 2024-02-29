import fs from "fs"
import schema from "./schema"
import { tablePath, writeJson, readJson, path } from "./util"
import { initTable } from "./table"
function checkDictory(p) {
  try {
    var stat = fs.statSync(path(p))
    if (!stat.isDirectory()) {
      fs.mkdirSync(path(p))
    }
  } catch (ex) {
    fs.mkdirSync(path(p))
  }
}
function checkFile(p, init = "") {
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, init)
  }
}

export async function initDB() {
  try {
    await checkDictory("data")
  } catch (ex) {
    process.appPath = process.resourcesPath
    await checkDictory("data")
  }
  console.log("db:", path("data"))

  await checkFile(path("config.json"), "{}")
  let systempConfig = await readJson("config")

  if (systempConfig.dbPath) {
    process.dbPath = systempConfig.dbPath
  }
  await checkDictory("snap")
  await checkDictory("data/store")
  await checkDictory("data/backup")
  await checkFile(path("data/meta.json"), "{}")
  await checkFile(path("data/table.json"), "[]")
  await checkFile(path("data/pk.json"), "{}")
  let TableList = readJson("data/table")
  for (let item of schema) {
    if (item && item.name) {
      if (item.type === "files") {
        checkDictory("data/store/" + item.name)
      } else {
        let init = item.type === "object" ? "{}" : "[]"
        if (item.init) {
          init = JSON.stringify(item.init)
        }
        checkFile(tablePath(item.name), init)
      }
    }
  }
  await writeJson("data/table", TableList)
  await initTable()
}
