import Selector from "./selector";
import Filter from "./filter";
import Action from "./action";
import { rename } from "fs-extra";

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
        path: item,
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

export default {
  async taskPreview({ selectors = [], filters = [], actions = [] }) {
    let res = [];
    let fileList = [];
    for (let selector of selectors) {
      fileList = await Selector[selector.type](selector.options);
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
  async taskExecute({ data }) {
    walkFiles(data, (item) => {
      if (item.action && item.action.operate) {
        if (item.action.operate === "rename") {
          rename(data.path, item.action.params.newName);
        }
      }
    });
  }
};
