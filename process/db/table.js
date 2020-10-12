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
    async delete(func) {
      let list = await readTable(name);
      let index = list.findIndex(func);
      if (index >= 0) {
        list.splice(index, 1);
      }
      return writeTable(name, list);
    },
    async set(data) {
      return writeTable(name, data);
    }
  };
}
