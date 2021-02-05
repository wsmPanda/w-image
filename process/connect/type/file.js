import { walkFilesAsync, isImage, isVideo, isWindows } from "../../util";
import { selectTable, selectFilesTable } from "../../db";
import { dialog, shell } from "electron";
import fs from "fs";
import util from "util";
import Iterator from "../../util/iterator";
import { path } from "../../db/util";
import { fdir } from "fdir";

function fileListToTree(list) {
  let res = [];
  let node = [];
  initData(0);
  function initData() {}
}

Iterator.onFinish = function(iterator) {
  let table = selectFilesTable("files_cache");
  if (iterator.options.file && !iterator.options.deep) {
    table.save(iterator.path.replace(/\//g, "==").replace(/\:/g, "++"), {
      path: iterator.path,
      data: iterator.runData,
      list: iterator.runList,
      createTime: +new Date(),
    });
  }
};
export default {
  selectDbPath() {
    return dialog
      .showOpenDialog({
        properties: ["openDirectory"],
      })
      .then((files) => {
        let path = files.filePaths[0];
        console.log(path);
        fs.writeFileSync(
          __dirname + "/config.json",
          JSON.stringify({ dbPath: path }, null, 2)
        );
      });
  },
  copyToDictory({ data }) {
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
  getTreeFiles({ path, formatFilter }) {
    formatFilter = formatFilter || ["image", "video"];
    return new Iterator(path, {
      file: true,
      filter(name) {
        console.log(formatFilter);
        let image = formatFilter(name);
        let video = isVideo(name);
        return (
          (formatFilter.includes("image") && image) ||
          (formatFilter.includes("video") && video) ||
          (formatFilter.includes("other") && !image && !video)
        );
      },
    }).run();
  },
  async getDictoryFolder({ path, deep }) {
    //let t = +new Date();

    // let api = new fdir()
    //   .withFullPaths()
    //   .group()
    //   .withMaxDepth(deep)
    //   .crawl(path);
    // return api.withPromise();
    return new Iterator(path, {
      file: false,
      deep,
    }).run();
  },
  cleanIterator({ type }) {
    return Iterator.clean({ type });
  },
  saveBlob({ file, name, time }) {
    fs.writeFile(
      `${path("snap")}/${name}==${time || +new Date()}.png`,
      file,
      {},
      (err) => {
        if (err) return console.error(err);
      }
    );
  },
};
