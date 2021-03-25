import Iterator from "../../util/iterator";
export default {
  async dictory({ path }) {
    let iterator = new Iterator(path, {
      file: true
      //list: true
    });
    let data = await iterator.run();
    return [data];
  },
  async collection() {},
  async tag() {}
};
