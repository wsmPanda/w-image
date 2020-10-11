import {
  walkFilesAsync,
  isImage,
  getDirectryTree,
  getDirectryFileTree,
} from "../../util";
import { selectTable } from "../../db";
import { dialog, shell } from "electron";
import fs from "fs";
import util from "util";
export default {
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
  openDictory({ path }) {
    shell.openItem;
    path = path.replace(/\//g, "\\");
    return shell.showItemInFolder(path);
  },
  deleteFile({ path }) {
    path = path.replace(/\//g, "\\");
    fs.unlinkSync(path);
  },
  async getFileInfo({ path }) {
    let info = await util.promisify(fs.stat)(path);
    return info;
  },
  getDictory() {
    return selectTable("dictory").get();
  },
  setConfig({ data }) {
    return selectTable("config").set(data);
  },
  getConfig() {
    return selectTable("config").get();
  },
  getStorage() {
    return selectTable("storage").get();
  },
  setStorage({ data }) {
    return selectTable("storage").set(data);
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
  },
};
