import { writeTable, readTable } from "./util";
export function selectTable(name) {
  return {
    get() {
      return readTable(name);
    },
    save(data) {
      return writeTable(name, data);
    },
    async add(data) {
      let list = await readTable(name, data);
      list.push(data);
      return writeTable(name, list);
    },
    async set(data) {
      return writeTable(name, data);
    }
  };
}
