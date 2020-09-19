import { isImage } from "./file";

var fs = require("fs");
export * from "./directory";
export * from "./file";
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
function walkFilesAsync(path, cb) {
  var pa = fs.readdirSync(path);
  pa.forEach(function(ele) {
    try {
      var info = fs.statSync(path + "/" + ele);
      if (info.isDirectory()) {
        walkFilesAsync(path + "/" + ele, cb);
      } else {
        cb && cb(path + "/" + ele);
      }
    } catch (ex) {
      console.log(ex);
    }
  });
}
function getDirectryTree(path, name) {
  let data = {
    path: name || path,
    sub: [],
  };
  var pa = fs.readdirSync(path);
  pa.forEach(function(ele) {
    try {
      var info = fs.statSync(path + "/" + ele);
      if (info.isDirectory()) {
        data.sub.push(getDirectryTree(path + "/" + ele, ele));
      } else {
        // data.sub.push(ele);
      }
    } catch (ex) {
      console.log(ex);
    }
  });

  return data;
}
function getDirectryFileTree(path, name) {
  let data = {
    path: name || path,
    sub: [],
    files: [],
  };
  var pa = fs.readdirSync(path);
  pa.forEach(function(ele) {
    try {
      var info = fs.statSync(path + "/" + ele);
      if (info.isDirectory()) {
        data.sub.push(getDirectryFileTree(path + "/" + ele, ele));
      } else if (isImage(ele)) {
        data.files.push(ele);
      }
    } catch (ex) {
      console.log(ex);
    }
  });

  return data;
}
export { walkFilesAsync, getDirectryTree, getDirectryFileTree };
