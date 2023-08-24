import Iterator from "../../util/iterator"
var fs = require("fs-extra")

export default {
  async file({ path, deep }, filters = []) {
    var info = await fs.stat(path)
    if (!info.isDirectory()) {
      return {
        path,
        type: "file"
      }
    }
    let iterator = new Iterator(path, {
      file: true,
      deep: deep,
      filter: (path) => {
        return !filters.length || !filters.find((filter) => !filter(path))
      }
      //list: true
    })
    let data = await iterator.run()
    return data
  },
  async dictory({ path, deep }, filters = []) {
    var info = await fs.stat(path)
    if (!info.isDirectory()) {
      return {
        path,
        type: "file"
      }
    }
    let iterator = new Iterator(path, {
      file: false,
      deep: deep,
      filter: (path) => {
        return !filters.length || !filters.find((filter) => !filter(path))
      }
      //list: true
    })
    let data = await iterator.run()
    return data
  },
  async collection() {},
  async tag() {}
}
