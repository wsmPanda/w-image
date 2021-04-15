import { rename, unlink, write } from "fs-extra";
function wait(t = 0) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, t);
  });
}
const Operations = {
  rename({ params }) {
    console.log("rename", params.path, params.newPath);
    return rename(params.path, params.newPath);
  },
  unlink({ params }) {
    console.log("unlink", params.path);
    return unlink(params.path);
  },
  write() {
    return write;
  },
  async test(action) {
    console.log("start", action);
    await wait(Math.random() * 2000);
    console.log("end", action);
    return;
  }
};
export default async function(data) {
  if (
    data &&
    data.action &&
    data.action.operate &&
    Operations[data.action.operate]
  ) {
    try {
      data.action.result = await Operations[data.action.operate](data.action);
    } catch (ex) {
      data.action.error = ex;
    }
  }
  return data;
}
