import Iterator from "../../util/iterator";
import { isImage, isVideo } from "../../util";
import { selectFilesTable } from "../../db";

export default {
  async fileListStream(arg) {
    let { path, iteratorId, step, cache } = arg;
    let iterator;
    if (iteratorId && Iterator.map[iteratorId]) {
      let cacheTable = selectFilesTable("files_cache");
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
            page: 1,
          };
        }
      } else {
        try {
          cacheTable.remove(path.replace(/\//g, "==").replace(/\:/g, "++"));
        } catch (ex) {}
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
        page: iterator.stepPage,
      };
    } else {
      iterator = new Iterator(path, {
        list: true,
        file: true,
        step,
        filter(name) {
          return isImage(name) || isVideo(name);
        },
      });
      return {
        path,
        iteratorId: iterator.id,
        data: [],
      };
    }
  },
};
