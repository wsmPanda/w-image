import {
  walkFilesAsync,
  isImage,
  getDirectryTree,
  getDirectryFileTree
} from "../../util";
import { selectTable } from "../../db";
import { dialog, shell } from "electron";
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
  openDictory({ path }) {
    return shell.showItemInFolder(path);
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
  }
};
