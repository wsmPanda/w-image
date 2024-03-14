import { app } from "electron"
import fs from "fs"
export function path(p) {
  // process.dbPath || process.appPath
  return `${app.getPath("appData")}/${p}`
}
export function readJson(name) {
  let data = fs.readFileSync(path(name) + ".json")
  return JSON.parse(data.toString())
}
export function writeJson(name, data) {
  fs.writeFileSync(
    path(name) + ".json",
    typeof data === "object" ? JSON.stringify(data, null, 2) : data
  )
}
export function tablePath(name) {
  return path(`data/store/${name}.json`)
}
export function readTable(name) {
  let data = fs.readFileSync(tablePath(name))
  try {
    let res = JSON.parse(data.toString())
    return res
  } catch (ex) {
    console.error(ex)
    return null
  }
}
export async function readTableSync(name) {
  return new Promise((resolve, reject) => {
    fs.readFile(tablePath(name), (err, data) => {
      if (err) {
        console.error(err)
        resolve(null)
      }
      try {
        let res = JSON.parse(data.toString())
        resolve(res)
      } catch (ex) {
        console.error(ex)
        resolve(null)
      }
    })
  })
}
export function writeTable(name, data) {
  try {
    let dataString = typeof data === "object" ? JSON.stringify(data, null, 2) : data.toString()
    fs.writeFile(tablePath(name), dataString, () => {})
  } catch (ex) {
    console.error("data stringify error:")
    console.error(data)
    console.error("ex")
  }
}

export function removeTable(name) {
  try {
    fs.unlink(tablePath(name), () => {})
  } catch (ex) {
    console.error(ex)
  }
}
