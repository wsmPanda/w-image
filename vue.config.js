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
  }
};
