import Iterator from "../../util/iterator";
import { isImage, isVideo } from "../../util";
export default {
  async fileListStream(arg) {
    let { path, iteratorId, step } = arg;
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
        page: iterator.stepPage
      };
    } else {
      iterator = new Iterator(path, {
        list: true,
        file: true,
        step,
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
