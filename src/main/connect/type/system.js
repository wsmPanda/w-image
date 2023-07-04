import icon from "../../../../resources/drag.png?asset"
import { app } from "electron"
export default {
  fileDrag({ path }, event) {
    event.sender.startDrag({
      file: path,
      icon: icon
    })
  },
  getStorePath() {
    return app.getPath("appData")
  }
}
