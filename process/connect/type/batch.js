import Iterator from "../../util/iterator";
import fs from "fs";
export default {
  async processBatch({ process, from, to, path, add, id, type }) {
    let iterator = new Iterator(path, {
      file: true,
      list: true,
    });

    await iterator.run();
    iterator.dataList.forEach((path) => {
      if (typeof path === "string") {
        // console.log(path.replace(new RegExp(`${from}`, "mg"), to));
        let l = path.split(".");
        let format = "";
        if (l.length > 1) {
          format = l.pop();
        }
        let res = path;
        if (add) {
          res = path + "." + to;
        } else {
          l.push(format.replace(new RegExp(`${from}`, "mg"), to));
          res = l.join(".");
        }
        fs.rename(path, res);
      }
    });
  },
};
