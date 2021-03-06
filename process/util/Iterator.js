import EventEmitter from "./event-emitter";
var fs = require("fs-extra");

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
    this.stepCount = 0;
    this.stepPage = 1;
    this.errorHeap = [];
    this.runData = {};
    this.runList = [];
    this.dataList = [];
    this.hasRun = false;
    this.on("finish", () => {
      if (FileIterator.onFinish) {
        FileIterator.onFinish(this);
      }
    });
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
  wait() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      });
    });
  }
  async next() {
    if (!this.finish) {
      this.stepCount = 0;
      this.dataList = [];
      if (this.state === "pause") {
        this.nextStep();
      } else if (!this.hasRun) {
        this.iteratorFiles(this.path).then(() => {
          this.finish = true;
        });
      }
      return new Promise((resolve) => {
        this.once("output", (e) => {
          resolve(e);
        });
      });
    } else {
      return [];
    }
  }
  async step(cb) {
    let iterator = this.iteratorFiles(this.path);
    let outputWatcher = this.on("output", (data) => {
      cb(data, () => {
        this.nextStep();
      });
    });
    return iterator.then(() => {
      outputWatcher.off();
    });
  }
  async iteratorFiles(path, deep = 0) {
    // 遍历器截断和暂停检查
    let data = {
      path: path,
      sub: [],
      files: [],
      finish: false
    };
    let row = {
      path: path,
      count: 0
    };
    this.dataList.push(row);
    this.runList.push(row);
    if (!deep) {
      this.runData = data;
    }
    var files = await fs.readdir(path);
    if (!this.options.deep || deep < this.options.deep) {
      let subDictory = [];
      // 分开处理文件和子目录，防止目录和文件在列表中混合出现
      for (let name of files) {
        try {
          var info = await fs.stat(path + "/" + name);
          //console.log(info);
          if (info.isDirectory()) {
            subDictory.push(name);
          } else if (this.options.file) {
            this.totalCount++;
            this.stepCount++;
            if (
              !this.options.filter ||
              (this.options.filter && this.options.filter(name, info))
            ) {
              let fileName = path + "/" + name;
              this.fileCount++;
              data.files.push(name);
              this.dataList.push(fileName);
              this.runList.push(fileName);
            }
            let access = await this.runGrard();
            if (!access) return;
          }
        } catch (ex) {
          this.errorHeap.push(ex);
        }
      }
      for (let name of subDictory) {
        try {
          this.totalCount++;
          this.stepCount++;
          row.count++;
          let sub = await this.iteratorFiles(path + "/" + name, deep + 1);
          if (sub) {
            data.sub.push(sub);
          }
        } catch (ex) {
          this.errorHeap.push(ex);
        }
        let access = await this.runGrard();
        if (!access) return;
      }
      data.hasRead = true;
    }
    data.finish = true;
    if (!deep) {
      this.finish = true;
      this.emit("finish");
      this.outputData();
    }
    return data;
  }
  outputData() {
    this.emit("output", {
      list: this.dataList,
      data: this.runData,
      finish: this.runData.finish,
      total: this.totalCount,
      step: this.stepPage
    });
  }
  waitNext() {
    return new Promise((resove) => {
      this.once("continue", () => {
        resove(true);
      });
      this.once("stop", () => {
        resove(false);
      });
    });
  }
  runGrard() {
    if (this.options.step && this.stepCount >= this.options.step) {
      this.outputData();
      this.setState("pause");
    }
    if (this.state === "stop") {
      return false;
    } else if (this.state === "pause") {
      return this.waitNext();
    }
    return true;
  }
  async stop() {
    // this.setState("finish");
    this.setState("stop");
  }
  async nextStep() {
    if (this.runData.finish || this.state !== "pause") {
      return;
    }
    this.setState("run");
    this.stepPage++;
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
