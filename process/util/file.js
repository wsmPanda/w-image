const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i;
function getSuffix(name) {
  return name && name.split(".").pop();
}
function isImage(name) {
  return IMAGE_REGEXP.test(name);
}
export { getSuffix, isImage };
