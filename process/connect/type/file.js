import { walkFilesAsync, isImage, isVideo, isWindows } from "../../util";
import { selectTable, selectFilesTable } from "../../db";
import { dialog, shell } from "electron";
import fs from "fs";
import util from "util";
import Iterator from "../../util/iterator";

Iterator.onFinish = function(iterator) {
  let table = selectFilesTable("files_cache");
  if (iterator.options.file && !iterator.options.deep) {
    table.save(iterator.path.replace(/\//g, "=="), {
      path: iterator.path,
      data: iterator.runData,
      list: iterator.runList,
      createTime: +new Date(),
    });
  }
};
export default {
  copyToDictory({ data }) {
    console.log(data);
    return dialog
      .showOpenDialog({
        properties: ["openFile", "openDirectory"],
      })
      .then((files) => {
        let path = files.filePaths[0];
        let nameMap = {};
        let index = 0;
        if (data && data.length) {
          for (let item of data) {
            let name = item.split("/").pop();
            if (nameMap[name]) {
              name = index + name;
            }
            nameMap[name] = true;
            index++;
            fs.copyFileSync(item, path + "/" + name);
          }
          if (isWindows()) {
            path = path.replace(/\//g, "\\");
          }
        }
        return shell.showItemInFolder(path + "\\" + data[0].split("/").pop());
      });
  },
  selectDictory() {
    return dialog
      .showOpenDialog({
        properties: ["openFile", "openDirectory"],
      })
      .then((files) => {
        return files.filePaths[0];
      });
  },
  addDictory({ path }) {
    return selectTable("dictory").add({ path, name: path.split("/").pop() });
  },
  deleteDictory({ path }) {
    return selectTable("dictory").delete((item) => item.path === path);
  },
  openDictory({ path }) {
    shell.openItem;
    if (isWindows()) {
      path = path.replace(/\//g, "\\");
    }
    return shell.showItemInFolder(path);
  },
  openFile({ path }) {
    if (isWindows()) {
      path = path.replace(/\//g, "\\");
    }
    return shell.openItem(path);
  },
  deleteFile({ path }) {
    if (isWindows()) {
      path = path.replace(/\//g, "\\");
    }
    fs.unlinkSync(path);
  },
  async getFileInfo({ path }) {
    let info = await util.promisify(fs.stat)(path);
    return info;
  },
  getDictory() {
    return selectTable("dictory").get();
  },
  selectFile({ path }) {
    let list = [];
    walkFilesAsync(path, (x) => {
      if (isImage(x)) {
        list.push(x);
      }
    });
    return list;
  },
  getTree({ path }) {
    return new Iterator(path, {
      file: false,
    }).run();
  },
  getTreeFiles({ path }) {
    return new Iterator(path, {
      file: true,
      filter(name) {
        return isImage(name) || isVideo(name);
      },
    }).run();
  },
  getDictoryFolder({ path, deep }) {
    return new Iterator(path, {
      file: false,
      deep,
    }).run();
  },
  cleanIterator({ type }) {
    return Iterator.clean({ type });
  },
};
