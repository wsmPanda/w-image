import fs from "fs";
export function path(p) {
  return `${process.dbPath || process.appPath || __dirname}/${p}`;
}
export function readJson(name) {
  let data = fs.readFileSync(path(name) + ".json");
  return JSON.parse(data.toString());
}
export function writeJson(name, data) {
  fs.writeFileSync(
    path(name) + ".json",
    typeof data === "object" ? JSON.stringify(data, null, 2) : data
  );
}
export function tablePath(name) {
  return path(`data/store/${name}.json`);
}
export function readTable(name) {
  let data = fs.readFileSync(tablePath(name));
  return JSON.parse(data.toString());
}
export function writeTable(name, data) {
  fs.writeFileSync(
    tablePath(name),
    typeof data === "object" ? JSON.stringify(data, null, 2) : data
  );
}

export function removeTable(name) {
  try {
    fs.unlinkSync(tablePath(name));
  } catch (ex) {}
}
