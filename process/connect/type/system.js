import Path from 'path'
export default {
  fileDrag({ path }, event) {
    console.log(Path.join(process.cwd(), "/drag.png"))
    event.sender.startDrag({
      file: path,
      icon: Path.join(process.cwd(), "/public/drag.png")
    });
  }
};
