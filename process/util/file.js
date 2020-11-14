const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i;
const videoSuffix = [
  "mp4",
  "flv",
  "f4v",
  "webm",
  "m4v",
  "mov",
  "3gp",
  "3g2",
  "rm",
  "rmvb",
  "wmv",
  "avi",
  "asf",
  "mpg",
  "mpeg",
  "mpe",
  "ts",
  "div",
  "dv",
  "divx",
  "vob",
  "dat",
  "mkv",
  "swf",
  "lavf",
  "cpk",
  "dirac",
  "ram",
  "qt",
  "fli",
  "flc",
  "mod",
];
function getSuffix(name) {
  return (
    name &&
    name
      .split(".")
      .pop()
      .toLowerCase()
  );
}
function isImage(name) {
  return IMAGE_REGEXP.test(name);
}
function isVideo(name) {
  return videoSuffix.includes(getSuffix(name));
}
export { getSuffix, isImage, isVideo };
