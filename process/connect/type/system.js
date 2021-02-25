export default {
  fileDrag({ path }, event) {
    event.sender.startDrag({
      file: path,
      icon: __static + "/drag.png"
    });
  }
};
