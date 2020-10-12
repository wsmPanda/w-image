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
  getDictoryCache() {
    return selectTable("dictory_cache").get();
  },
  saveDictoryCache({ data }) {
    return selectTable("dictory_cache").set(data);
  }
};
