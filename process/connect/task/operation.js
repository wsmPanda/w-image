import { rename, unlink, write } from "fs-extra";
function wait(t = 0) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, t);
  });
}
const Operations = {
  rename() {
    rename;
  },
  unlink() {
    unlink;
  },
  write() {
    write;
  },
  async test(action) {
    console.log("start", action);
    await wait(Math.random * 3000);
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
      data.action.result = await Operations["test" || data.action.operate](
        data.action.operate
      );
    } catch (ex) {
      data.action.error = ex;
    }
  }
  return data;
}
