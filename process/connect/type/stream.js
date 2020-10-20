import Iterator from "../../util/iterator";
import { isImage, isVideo } from "../../util";
export default {
  async fileListStream({ path, iteratorId, action }) {
    console.log("fileListStream", { path, iteratorId, action });
    let iterator;
    if (iteratorId && Iterator.map[iteratorId]) {
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
        page: iterator.setpPage
      };
    } else {
      iterator = new Iterator(path, {
        list: true,
        file: true,
        filter(name) {
          return isImage(name) || isVideo(name);
        }
      });
      return {
        path,
        iteratorId: iterator.id,
        data: []
      };
    }
  }
};
