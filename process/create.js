import Connect from "./connect";
import { initDB, selectTable } from "./db";
export default async function(win) {
  initDB();
  Connect();
  let resizeTimmer;
  let storage = selectTable("storage").get();
  win.on("resize", () => {
    if (resizeTimmer) {
      clearTimeout(resizeTimmer);
    }
    resizeTimmer = setTimeout(() => {
      resizeTimmer = null;
      let storage = selectTable("storage").get();
      storage.windowPosition = win.getContentBounds();
      selectTable("storage").save(storage);
    }, 300);
  });
  if (storage && storage.windowPosition) {
    win.setSize(storage.windowPosition.width, storage.windowPosition.height);
    win.setPosition(storage.windowPosition.x, storage.windowPosition.y);
  }
}
