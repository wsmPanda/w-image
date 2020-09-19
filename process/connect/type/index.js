import {
  walkFilesAsync,
  isImage,
  getDirectryTree,
  getDirectryFileTree,
} from "../../util";
import { selectTable } from "../../db";
import { dialog } from "electron";
export default {
  selectDictiry() {
    return dialog
      .showOpenDialog({
        properties: ["openFile", "openDirectory"],
      })
      .then((files) => {
        return files.filePaths[0];
      });
  },
  addDictiry({ path }) {
    return selectTable("dictory").add({ path });
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
};
