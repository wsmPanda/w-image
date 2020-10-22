import { writeTable, readTable } from "./util";
export function selectFilesTable(name) {
  return {
    save(key, data) {
      return writeTable(name + "/" + key, data);
    },
    remove() {},
    async get(key) {
      try {
        return readTable(name + "/" + key);
      } catch (ex) {
        return null;
      }
    },
    list() {}
  };
}
export function selectTable(name) {
  return {
    async get() {
      return await readTable(name);
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
