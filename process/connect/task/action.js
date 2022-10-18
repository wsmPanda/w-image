let nameMap = {};

export default {
  async delete() {
    return function({ path }) {
      return {
        operate: "unlink",
        params: {
          path
        }
      };
    };
  },
  async rename() {},
  async clear() {},
  async format() {},
  async hull() {},
  async move() {},
  async cpoy() {},
  resort(options, aNumberMap = {}) {
    return function(data) {
      let path = data.path;
      let pathList = path.split(/\\|\//);
      let str = pathList.pop();

      if (nameMap[str]) {
        return {
          operate: "rename",
          message: "",
          params: {
            path,
            newPath: path,
            newName: str + " " + nameMap[str]
          },
          extra: "aNumber"
        };
      } else {
        nameMap[str] = path;
        return {
          operate: "rename",
          message: null,
          params: {
            path,
            newPath: path,
            newName: "xxxx"
          },
          extra: "aNumber"
        };
      }
    };
  },
  aNumber(options, aNumberMap = {}) {
    let nameMap = {};
    return function({ path }) {
      let pathList = path.split(/\\|\//);
      let name = pathList.pop();
      let nameList = name.split(".");
      let format = nameList.pop();
      let str = nameList.join(".");
      let match =
        str.match(/([A-Za-z]{2,6})-([0-9]{2,8})([-_]?0?[a-d1-9])?/) ||
        str.match(/([A-Za-z]{2,6})-?([0-9]{2,8})=([-_]?0?[A_Da-d1-9])?/) ||
        str.match(/([A-Za-z]{1,6})-?([0-9]{2,8})([-_]?0?[A_Da-d1-9])?/) ||
        str.match(/([A-Za-z\-]{1,7})-?([0-9]{4,10})([-_]?0?[A_Da-d1-9])?/);
      if (match && match[1]) {
        let code = match[1].toUpperCase();
        let newName = code + "-" + match[2];
        if (match[3]) {
          newName = newName + "_" + match[3].replace(/-|_/g, "");
        }
        let newPath = pathList.join("/") + "/" + newName + "." + format;
        if (nameMap[newPath]) {
          newPath +=
            pathList.join("/") +
            "/" +
            newName +
            `-${nameMap[newPath]}` +
            "." +
            format;
          nameMap[newPath]++;
        } else {
          nameMap[newPath] = 1;
        }
        return {
          operate: "rename",
          message: match,
          params: {
            current: aNumberMap[newName],
            path,
            code,
            newPath: newPath,
            newName
          },
          extra: "aNumber"
        };
      } else {
        return {
          error: true,
          message: "编号无法识别"
        };
      }
    };
  }
};
