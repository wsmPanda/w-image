import fs from "fs";
import schema from "./schema";
import { tablePath, writeJson, readJson } from "./util";
import { initTable } from "./table";

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

export async function initDB() {
  await checkDictory("snap");
  await checkDictory("data");
  await checkDictory("data/store");
  await checkDictory("data/backup");
  await checkFile(path("data/meta.json"), "{}");
  await checkFile(path("data/table.json"), "[]");
  await checkFile(path("data/pk.json"), "{}");
  let TableList = readJson("data/table");
  for (let item of schema) {
    if (item && item.name) {
      if (item.type === "files") {
        checkDictory("data/store/" + item.name);
      } else {
        let init = item.type === "object" ? "{}" : "[]";
        if (item.init) {
          init = JSON.stringify(item.init);
        }
        checkFile(tablePath(item.name), init);
      }
    }
  }
  await writeJson("data/table", TableList);
  await initTable();
}
