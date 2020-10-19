import EventEmitter from "./event-emitter";
const util = require("util");
var fs = require("fs");
/*
？遍历预估进度
多进程异步处理
读取进度报告，定时触发返回当前处理目录
报错记录

设置数据上限，和超时时间防止进入死循环



数据更新机制
  后台空闲遍历目录，可通过刷新按钮强制遍历

记录文件读取缓存，缓存完整读取的目录，防止重复读取（可通过配置关闭）
？后台运行目录读取

*/

/**
 文件过滤条件
 filter:Function
 限制遍历层数
 deep:Number
 包括文件遍历
 file：false
 一阶段步长
 step:null
 数据附带info对象
 info:false
 */

class FileIterator extends EventEmitter {
  constructor(path, options) {
    super();
    this.path = path;
    this.options = options;
    this.id = FileIterator.getId();
    FileIterator.map[this.id] = this;
    this.totalCount = 0;
    this.fileCount = 0;
    this.setpCount = 0;
    this.setpPage = 1;
    this.errorHeap = [];
    this.runData = null;
    this.setState("ready");
  }
  async run() {
    this.setState("run");
    this.runStartTime = +new Date();
    let data = await this.iteratorFiles(this.path);
    this.endStartTime = +new Date();
    this.setState("finish");
    FileIterator.map[this.id] = null;
    if (this.setState === "stop") {
      data = null;
    }
    return data;
  }
  async setp(cb) {
    let iterator = this.iteratorFiles(this.path);
    let outputWatcher = this.on("output", (data) => {
      cb(data, () => {
        this.next();
      });
    });
    return iterator.then(() => {
      outputWatcher.off();
    });
  }
  async iteratorFiles(path, deep = 0) {
    // 遍历器截断和暂停检查
    let access = await this.runGrard();
    if (!access) return;
    let data = {
      path: path,
      sub: [],
      files: [],
      finish: false,
    };
    if (!deep) {
      this.runData = data;
    }
    var files = await util.promisify(fs.readdir)(path);
    if (!this.options.deep || deep < this.options.deep) {
      for (let name of files) {
        try {
          this.totalCount++;
          this.setpCount++;
          var info = await util.promisify(fs.stat)(path + "/" + name);
          if (info.isDirectory()) {
            let sub = await this.iteratorFiles(path + "/" + name, deep + 1);
            if (sub) {
              data.sub.push(sub);
            }
          } else if (this.options.file) {
            if (this.options.filter) {
              if (this.options.filter(name, info)) {
                this.fileCount++;
                data.files.push(name);
              }
            } else {
              this.fileCount++;
              data.files.push(name);
            }
          }
        } catch (ex) {
          this.errorHeap.push(ex);
        }
      }
      data.hasRead = true;
    }
    data.finish = true;
    return data;
  }
  outputData() {
    this.$emit("output", {
      data: this.tempData,
      finish: this.tempData.finish,
      total: this.totalCount,
      setp: this.setpPage,
    });
  }
  runGrard() {
    if (this.options.setp && this.stepCount >= this.options.setp) {
      this.outputData();
    }
    if (this.setState === "stop") {
      return false;
    } else if (this.setState === "pause") {
      return new Promise((resove) => {
        this.once("continue", () => {
          resove(true);
        });
        this.once("stop", () => {
          resove(false);
        });
      });
    }
    return true;
  }
  async stop() {
    this.setState("finish");
    this.setState("stop");
  }
  async next() {
    if (this.tempData.finish || this.setState !== "pause") {
      return;
    }
    this.setState("run");
    this.setpPage++;
    this.emit("continue");
  }
  destory() {
    this.stop();
    FileIterator.map[this.id] = null;
  }
  setState(v) {
    this.state = v;
    this.emit(v);
  }
}
FileIterator.idCounter = 0;
FileIterator.getId = function() {
  FileIterator.idCounter++;
  return FileIterator.idCounter;
};
FileIterator.map = {};
FileIterator.clean = function() {
  for (let code in FileIterator.map) {
    if (FileIterator.map[code]) {
      FileIterator.map[code].destory();
    }
  }
};
export default FileIterator;
