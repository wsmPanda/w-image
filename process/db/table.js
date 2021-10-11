import { writeTable, readTable, removeTable } from "./util";
export const TableStatus = {
  pkMap: {},
  init: false
};
export function initTable() {}
export function selectFilesTable(name) {
  return {
    async save(key, data) {
      return writeTable(name + "/" + key, data);
    },
    async remove(key) {
      return removeTable(name + "/" + key);
    },
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
    async merge(data) {
      let oldData = await this.get();
      console.log(data, oldData);
      return writeTable(name, { ...oldData, ...data });
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
