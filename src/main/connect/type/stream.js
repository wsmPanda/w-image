import Iterator from "../../util/iterator";
import { isImage, isVideo } from "../../util";
import { selectFilesTable } from "../../db";
import { fdir } from "fdir";
let counter = 0;
function fileListToList(list) {
  return list.reduce((res, item) => {
    res.push({ path: item.dir });
    return res.concat(item.files);
  }, []);
}
export default {
  async allFileList(arg) {
    let { path, iteratorId } = arg;
    if (!iteratorId) {
      iteratorId = counter++;
    }
    let api = new fdir()
      .withFullPaths()
      .filter(path => {
        return isImage(path) || isVideo(path);
      })
      //.withDirs()
      .group()
      .crawl(path);
    let res = await api.withPromise();
    let data = fileListToList(res);
    return data;
  },
  async fileListStream(arg) {
    let { path, iteratorId, step, cache, formatFilter } = arg;
    let iterator;
    formatFilter = formatFilter || ["image", "video"];
    if (iteratorId && Iterator.map[iteratorId]) {
      let cacheTable = selectFilesTable("files_cache");
      cache = false;
      if (cache !== false) {
        let cacheData = await cacheTable.get(
          path.replace(/\//g, "==").replace(/\:/g, "++")
        );
        if (cacheData) {
          Iterator.map[iteratorId] && Iterator.map[iteratorId].destory();
          return {
            path,
            iteratorId,
            data: cacheData.list,
            finish: true,
            page: 1
          };
        }
      } else {
        // try {
        //   cacheTable.remove(path.replace(/\//g, "==").replace(/\:/g, "++"));
        // } catch (ex) {
        //   console.error(ex);
        // }
      }
      iterator = Iterator.map[iteratorId];
      let data = [];
      if (!iterator.finish) {
        data = await iterator.next();
      }
      return {
        path,
        iteratorId,
        data: data.list,
        finish: iterator.finish,
        page: iterator.stepPage
      };
    } else {
      iterator = new Iterator(path, {
        list: true,
        file: true,
        step,
        filter(name) {
          let image = isImage(name);
          let video = isVideo(name);
          return (
            (formatFilter.includes("image") && image) ||
            (formatFilter.includes("video") && video) ||
            (formatFilter.includes("other") && !image && !video)
          );
        }
      });
      console.log();
      return {
        path,
        iteratorId: iterator.id,
        data: []
      };
    }
  }
};
