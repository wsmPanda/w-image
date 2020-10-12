import {
  walkFilesAsync,
  isImage,
  getDirectryTree,
  getDirectryFileTree,
  isWindows
} from "../../util";
import { selectTable } from "../../db";
import { dialog, shell } from "electron";
import fs from "fs";
import util from "util";
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
    return getDirectryTree(path);
  },
  getTreeFiles({ path }) {
    return getDirectryFileTree(path);
  },
  getDictoryFolder({ path }) {
    return getDirectryTree(path, null, true);
  }
};
