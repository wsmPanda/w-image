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
  async setStorage({ data }) {
    let oldData = await selectTable("storage").get();
    return selectTable("storage").set({ ...oldData, ...data });
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
  async editData({ table, data }) {
    let list = await selectTable(table).get();
    let index = list.findIndex((item) => item[data.code] === data.value);
    list[index] = data.data;
    return selectTable(table).set(list);
  },
  deleteData({ table, data }) {
    let { code, value } = data;
    console.log(table, data)
    return selectTable(table).delete((item) => item[code] === value);
  }
};
