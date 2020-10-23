import { selectTable } from "../../db";
export default {
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
  async getStorageValue({ code }) {
    return (await selectTable("storage").get())[code];
  },
  async setStorageValue({ code, value }) {
    let data = await selectTable("storage").get();
    data[code] = value;
    return selectTable("storage").set(data);
  },
  getDictoryCache() {
    return selectTable("dictory_cache").get();
  },
  saveDictoryCache({ data }) {
    return selectTable("dictory_cache").set(data);
  },
  // 数据表通用存取方法
  setData({ table, data }) {
    return selectTable(table).set(data);
  },
  getData({ table }) {
    return selectTable(table).get();
  },
  addData({ table, data }) {
    return selectTable(table).add(data);
  },
  deleteData({ table, code, value }) {
    return selectTable(table).delete((item) => item[code] === value);
  }
};
