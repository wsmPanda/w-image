import Selector from "./selector"
import Filter from "./filter"
import Action from "./action"
import operationExecute from "./operation"
import { selectTable } from "../../db"
import { unlink } from "fs-extra"

function getFileObject(data) {
  let res = {
    path: data.path,
    sub: [],
    type: "dictory"
  }
  if (data.sub) {
    data.sub.forEach((item) => {
      res.sub.push(getFileObject(item))
    })
  }
  if (data.type === "file") {
    res.sub.push({
      path: data.path,
      type: "file"
    })
  }
  data.files &&
    data.files.forEach((item) => {
      res.sub.push({
        path: data.path + "/" + item,
        type: "file"
      })
    })
  return res
}

async function walkFiles(data, func) {
  if (data.sub) {
    data.sub.forEach((item) => {
      if (item.type === "dictory") {
        walkFiles(item, func)
        func(item)
      } else {
        func(item)
      }
    })
  }
}
async function walkSyncFiles(data, func) {
  if (data.sub) {
    for (let item of data.sub) {
      if (item.type === "dictory") {
        await walkSyncFiles(item, func)
      } else {
        await func(item)
      }
    }
  }
}

export default {
  async taskPreview({ selectors = [], filters = [], actions = [] }) {
    let res = []
    let fileList = []
    let fliterList = filters.map((filter) => {
      if (filter.type && Filter[filter.type]) {
        return Filter[filter.type](filter.options)
      } else {
        return () => true
      }
    })
    for (let selector of selectors) {
      fileList.push(await Selector[selector.type](selector.options, fliterList))
    }
    res = getFileObject(fileList[0])
    let numberMap = await selectTable("number_map").get()
    let actionsRuner = actions.map((action) => Action[action.type](action.options, numberMap))
    walkFiles(res, (data) => {
      actionsRuner.forEach((action) => {
        data.action = action(data)
      })
    })
    if (res.sub) {
      const sub = res.sub
      res.sub = []
      sub.forEach((item) => {
        console.log(item)
        if (item.action && item.action.operate === "batch") {
          item.action.data.forEach((d) =>
            res.sub.push({
              path: d.path,
              type: "file",
              action: d
            })
          )
        } else {
          res.sub.push(item)
        }
      })
    }
    console.log(res)
    return res
  },
  async taskExecute({ data, track, selected }, event, callback) {
    console.log("taskExecute", data)
    let promiseList = []
    let result = {
      data: data,
      errorList: [],
      total: 0,
      done: 0,
      error: 0
    }
    track = track || 5
    let trackCount = 0
    let finishCallback
    function executeTrack() {
      if (trackCount < track) {
        return
      } else {
        return new Promise((resolve) => {
          finishCallback = resolve
        })
      }
    }
    callback(result)
    walkFiles(data, (item) => {
      if (item.action && item.action.operate && (!selected || selected.indexOf(item.path) >= 0)) {
        result.total++
      }
    })
    let aNumberMap = {}
    await walkSyncFiles(data, async (item) => {
      await executeTrack()
      if (item.action && item.action.operate) {
        if (!selected || selected.indexOf(item.path) >= 0) {
          trackCount++
          promiseList.push(
            operationExecute(item)
              .then((res) => {
                if (res.action && res.action.error) {
                  result.errorList.push(item)
                  result.error++
                }
                if (item.action && item.action.extra && item.action.operate === "rename") {
                  if (item.action.extra === "aNumber") {
                    aNumberMap[item.action.params.newName] = item.action.params.newPath
                    if (
                      item.action.params.current &&
                      item.action.params.current !== item.path &&
                      item.action.params.current !== item.action.params.newPath
                    ) {
                      unlink(item.action.params.current)
                    }
                  }
                }
                result.done++
              })
              .catch((ex) => {
                result.errorList.push(ex)
                result.done++
                result.error++
              })
              .finally(() => {
                result.trackCount = trackCount
                trackCount--
                finishCallback && finishCallback()
                callback(result)
              })
          )
        }
      }
    })
    await Promise.all(promiseList)
    if (Object.keys(aNumberMap).length) {
      selectTable("number_map").merge(aNumberMap)
    }
    return result
  }
}
