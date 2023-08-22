import { getSuffix, isVideo } from "../../util"
export default {
  format(options) {
    if (options.type) {
      return (path) => {
        return isVideo(path)
      }
    } else {
      return () => true
    }
  },
  suffix(options) {
    if (options.suffix) {
      let suffix = options.suffix.split(",")
      return (path) => {
        return suffix.includes(getSuffix(path))
      }
    } else {
      return () => true
    }
  },
  regexp() {},
  name() {},
  size() {}
}
