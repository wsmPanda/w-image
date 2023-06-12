import { isVideo } from "../../util";
export default {
  format(options) {
    if (options.type) {
      return path => {
        return isVideo(path);
      };
    } else {
      return () => true;
    }
  },
  async regexp() {},
  async name() {},
  async size() {}
};
