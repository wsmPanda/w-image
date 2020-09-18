const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  pages: {
    index: {
      // page 的入口
      entry: "render/main.js"
    }
  },
  pluginOptions: {
    electronBuilder: {
      mainProcessWatch: ["process/main", "process"],
      mainProcessFile: "process/main"
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias.set("render", resolve("./render"));
    config.resolve.alias.set("process", resolve("./process"));
  }
};
