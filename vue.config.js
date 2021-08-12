const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  pages: {
    index: {
      // page 的入口 2 2
      entry: "render/main.js"
    }
  },
  pluginOptions: {
    electronBuilder: {
      chainWebpackMainProcess: config => {
        config.plugin("define").tap(args => {
          args[0]["process.env.FLUENTFFMPEG_COV"] = false;
          return args;
        });
      },
      chainWebpackRendererProcess: config => {
        config.plugin("define").tap(args => {
          args[0]["process.env.FLUENTFFMPEG_COV"] = false;
          return args;
        });
      },
      externals: ["ffmpeg", "@ffmpeg-installer/ffmpeg", "fluent-ffmpeg"],
      mainProcessWatch: ["process/main", "process"],
      mainProcessFile: "process/main"
    }
  },
  chainWebpack: config => {
    config.resolve.alias.set("render", resolve("./render"));
    config.resolve.alias.set("process", resolve("./process"));
  }
};
