import Iterator from "../../util/iterator";
export default {
  async dictory({ path, deep }, filters = []) {
    let iterator = new Iterator(path, {
      file: true,
      deep: deep,
      filter: path => {
        return !filters.length || !filters.find(filter => !filter(path));
      }
      //list: true
    });
    let data = await iterator.run();
    return data;
  },
  async collection() {},
  async tag() {}
};
