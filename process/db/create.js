import fs from "fs";
import schema from "./schema";
import { tablePath } from "./util";
import { writeJson, readJson } from "./util";

function path(p) {
  return `${__dirname}/${p}`;
}
function checkDictory(p) {
  try {
    var stat = fs.statSync(path(p));
    if (!stat.isDirectory()) {
      fs.mkdirSync(path(p));
    }
  } catch (ex) {
    fs.mkdirSync(path(p));
  }
}
function checkFile(p, init = "") {
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, init);
  }
}

export function initDB() {
  checkDictory("data");
  checkDictory("data/store");
  checkDictory("data/backup");
  checkFile(path("data/meta.json"), "{}");
  checkFile(path("data/table.json"), "[]");
  let TableList = readJson("data/table");
  for (let item of schema) {
    if (item && item.name) {
      let init = item.type === "object" ? "{}" : "[]";
      if (item.init) {
        init = JSON.stringify(item.init);
      }
      checkFile(tablePath(item.name), init);
    }
  }
  writeJson("data/table", TableList);
}
