import icon from "../../../../resources/drag.png?asset"
export default {
  fileDrag({ path }, event) {
    event.sender.startDrag({
      file: path,
      icon: icon
    })
  }
}
