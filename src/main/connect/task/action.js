import fs from "fs"
function readJson(name) {
  let data = fs.readFileSync(name)
  return JSON.parse(data.toString())
}

export default {
  delete() {
    return function ({ path }) {
      return {
        operate: "unlink",
        message: "delete",
        params: {
          path
        }
      }
    }
  },
  rename() {},
  clear() {},
  format() {},
  hull() {},
  move(options) {
    return function ({ path }) {
      let name = path.split(/\\|\//).pop()

      return {
        operate: "rename",
        message: " -> " + options.path + "/" + name,
        params: {
          path,
          newPath: options.path + "/" + name
        }
      }
    }
  },
  copy() {
    return function ({ path }) {
      let name = path.split(/\\|\//).pop()

      return {
        operate: "copy",
        message: " -> " + options.path + "/" + name,
        params: {
          path,
          newPath: options.path + "/" + name
        }
      }
    }
  },
  uniformSuffix(options) {
    return function ({ path }) {
      let pathList = path.split(/\\|\//)
      let name = pathList.pop()
      let nameList = name.split(".")
      let newName = nameList.shift() + "." + options.suffix
      let newPath = [...pathList, newName].join()
      return {
        operate: "rename",
        message: match,
        params: {
          path,
          newPath: newPath,
          newName
        }
      }
    }
  },
  cleanEmpty(options) {},
  aNumberCompare(options, aNumberMap = {}) {
    // let nameMap = {};
    return function ({ path }) {
      const cMap = readJson(path)
      const res = {
        operate: "batch",
        data: []
      }
      for (let name in aNumberMap) {
        if (cMap[name]) {
          res.data.push({
            path: aNumberMap[name],
            operate: "unlink",
            params: {
              current: cMap[name],
              path: aNumberMap[name],
              name,
              newPath: aNumberMap[name],
              newName: name
            }
          })
        }
      }
      return res
    }
  },
  aNumber(options, aNumberMap = {}) {
    let nameMap = {}
    return function ({ path }) {
      let pathList = path.split(/\\|\//)
      let name = pathList.pop()
      let nameList = name.split(".")
      let format = nameList.pop()
      let str = nameList.join(".")
      let match =
        str.match(/([A-Za-z]{2,6})-([0-9]{2,8})([-_]?0?[a-d1-9])?/) ||
        str.match(/([A-Za-z]{2,6})-?([0-9]{2,8})=([-_]?0?[A_Da-d1-9])?/) ||
        str.match(/([A-Za-z]{1,6})-?([0-9]{2,8})([-_]?0?[A_Da-d1-9])?/) ||
        str.match(/([A-Za-z\-]{1,7})-?([0-9]{4,10})([-_]?0?[A_Da-d1-9])?/)
      if (match && match[1]) {
        let code = match[1].toUpperCase()
        let newName = code + "-" + match[2]
        if (match[3]) {
          newName = newName + "_" + match[3].replace(/-|_/g, "")
        }
        let newPath = pathList.join("/") + "/" + newName + "." + format
        if (nameMap[newPath]) {
          newPath += pathList.join("/") + "/" + newName + `-${nameMap[newPath]}` + "." + format
          nameMap[newPath]++
        } else {
          nameMap[newPath] = 1
        }
        return {
          operate: "rename",
          message: aNumberMap[newName]
            ? "x" + aNumberMap[newName] + " ->" + newName
            : "->" + newName,
          params: {
            current: aNumberMap[newName],
            path,
            code,
            newPath: newPath,
            newName
          },
          extra: "aNumber"
        }
      } else {
        return {
          error: true,
          message: "编号无法识别"
        }
      }
    }
  }
}
