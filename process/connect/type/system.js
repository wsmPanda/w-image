export default {
  fileDrag({ path }, event) {
    console.log();
    event.sender.startDrag({
      file: path,
      icon: "logo.png"
    });
  }
};
