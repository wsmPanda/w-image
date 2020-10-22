const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i;
export function getSuffix(name) {
  return name && name.split(".").pop();
}
export function isImage(name) {
  return IMAGE_REGEXP.test(name);
}
export function cloneJson(obj) {
  if (obj && typeof obj === "object") {
    return JSON.parse(JSON.stringify(obj));
  } else {
    return obj;
  }
}
// 合并对象，参数1数值优先级高于参数2,可作为补充默认值用
// 不会改变原对象，会生成新对象
export function mergeObject(o1, o2) {
  if (isEmpty(o2)) return o1;
  if (isEmpty(o1)) return o2;
  if (typeof o2 === "object") {
    let res;
    if (Array.isArray(o1)) {
      res = [...o1];
    } else {
      res = {
        ...o1
      };
    }
    for (let key in o2) {
      res[key] = mergeObject(res[key], o2[key]);
    }
    return res;
  } else {
    return o1;
  }
} // 会改变原对象，不会生成新对象
export function mergeOnObject(o1, o2) {
  if (isEmpty(o2)) return o1;
  if (isEmpty(o1)) return o2;
  if (typeof o2 === "object") {
    for (let key in o2) {
      o1[key] = mergeObject(o1[key], o2[key]);
    }
  }
  return o1;
}
export function isEmpty(v) {
  return v === null || v === undefined || v === "" || Number.isNaN(v);
}
// 验证参数是否为空对象
export function isEmptyObject(v) {
  if (!v) return false;
  if (typeof v === "object") {
    const str = JSON.stringify(v);
    return str === "{}" || str === "[]";
  } else {
    return true;
  }
}
// 对比对象属性是否相等
// 功能暂未全面
export function compareObject(a, b) {
  if (a === b) return true;
  if ((a && !b) || (b && !a)) return false;
  if (typeof a === "object" && typeof b === "object") {
    if (Object.keys(a).length !== Object.keys(b).length) return false;
    for (let key in a) {
      if (!compareObject(a[key], b[key])) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}

// 数组去重
export function uniqArray(arr = []) {
  return Array.from(new Set(arr));
}

export function functionDebounce(func, t = 300) {
  let timer;
  return function(...arg) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      return func(...(arg || {}));
    }, t);
  };
}
