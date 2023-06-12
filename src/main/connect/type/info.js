import { selectTable } from "../../db";

export default {
  async setInfo({ path, code, value }) {
    let data = (await selectTable("info").get()) || {};
    let list = path.split(/\\|\//);
    let node = { path: "", sub: data };
    for (let name of list) {
      if (!node.sub) {
        node.sub = {};
      }
      if (!node.sub[name]) {
        node.sub[name] = {};
      }
      node = node.sub[name];
    }
    node.data = node.data || {};
    node.data[code] = value;
    await selectTable("info").set(data);
  },
  async getInfo({ path }) {
    let data = await selectTable("info").get();
    let list = path.split(/\\|\//);
    let node = { path: "", sub: data };
    for (let name of list) {
      if (node.sub && node.sub[name]) {
        node = node.sub[name];
      } else {
        node = null;
        break;
      }
    }
    return node;
  }
};
