import Selector from "./selector";
import Filter from "./filter";
import Action from "./action";
import operationExecute from "./operation";
function getFileObject(data) {
  let res = {
    path: data.path,
    sub: [],
    type: "dictory"
  };
  data.sub.forEach((item) => {
    res.sub.push(getFileObject(item));
  });
  data.files &&
    data.files.forEach((item) => {
      res.sub.push({
        path: data.path + "/" + item,
        type: "file"
      });
    });
  return res;
}

async function walkFiles(data, func) {
  if (data.sub) {
    data.sub.forEach((item) => {
      if (item.type === "dictory") {
        walkFiles(item, func);
      } else {
        func(item);
      }
    });
  }
}
async function walkSyncFiles(data, func) {
  if (data.sub) {
    for (let item of data.sub) {
      if (item.type === "dictory") {
        await walkSyncFiles(item, func);
      } else {
        await func(item);
      }
    }
  }
}

export default {
  async taskPreview({ selectors = [], filters = [], actions = [] }) {
    let res = [];
    let fileList = [];
    for (let selector of selectors) {
      fileList.push(await Selector[selector.type](selector.options));
    }
    res = getFileObject(fileList[0]);
    let actionsRuner = actions.map((action) =>
      Action[action.type](action.options)
    );
    walkFiles(res, (data) => {
      actionsRuner.forEach((action) => {
        data.action = action(data);
      });
    });
    return res;
  },
  async taskExecute({ data, track }, event, callback) {
    let promiseList = [];
    let result = {
      data: data,
      errorList: [],
      total: 0,
      done: 0,
      error: 0
    };
    track = track || 5;
    let trackCount = 0;
    let finishCallback;
    function executeTrack() {
      if (trackCount < track) {
        return;
      } else {
        return new Promise((resolve) => {
          finishCallback = resolve;
        });
      }
    }
    callback(result);
    walkFiles(data, (item) => {
      if (item.action && item.action.operate) {
        result.total++;
      }
    });
    await walkSyncFiles(data, async (item) => {
      await executeTrack();
      if (item.action && item.action.operate) {
        trackCount++;
        promiseList.push(
          operationExecute(item)
            .then((res) => {
              if (res.action && res.action.error) {
                result.errorList.push(item);
                result.error++;
              }
              result.done++;
            })
            .catch((ex) => {
              result.errorList.push(ex);
              result.done++;
              result.error++;
            })
            .finally(() => {
              result.trackCount = trackCount;
              trackCount--;
              finishCallback && finishCallback();
              callback(result);
            })
        );
      }
    });
    await Promise.all(promiseList);
    return result;
  }
};
