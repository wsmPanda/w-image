function path(p) {
  return `${__dirname}/${p}`;
}
import fs from "fs";

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
    typeof data === "object" ? JSON.stringify(data) : data
  );
}
