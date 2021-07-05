import Iterator from "../../util/iterator";
export default {
  async dictory({ path, deep }) {
    let iterator = new Iterator(path, {
      file: true,
      deep: deep
      //list: true
    });
    let data = await iterator.run();
    return data;
  },
  async collection() {},
  async tag() {}
};
