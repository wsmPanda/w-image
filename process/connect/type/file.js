import { walkFilesAsync, isImage, isVideo, isWindows } from "../../util";
import { selectTable } from "../../db";
import { dialog, shell } from "electron";
import fs from "fs";
import util from "util";
import Iterator from "../../util/iterator";
export default {
  selectDictory() {
    return dialog
      .showOpenDialog({
        properties: ["openFile", "openDirectory"]
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
      file: false
    }).run();
  },
  getTreeFiles({ path }) {
    return new Iterator(path, {
      file: true,
      filter(name) {
        return isImage(name) || isVideo(name);
      }
    }).run();
  },
  getDictoryFolder({ path, deep }) {
    return new Iterator(path, {
      file: false,
      deep
    }).run();
  }
};
