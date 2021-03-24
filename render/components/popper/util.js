const util = {
  getRelativePostion(ele, parent) {
    let res = {
      top: 0,
      left: 0,
      height: ele.offsetHeight,
      width: ele.offsetWidth
    };
    let node = ele;
    while (parent.contains(node) && parent !== node) {
      res.top += node.offsetTop;
      res.left += node.offsetLeft;
      node = node.offsetParent;
    }
    node = ele;
    while (parent.contains(node)) {
      res.top -= node.scrollTop;
      res.left -= node.scrollLeft;
      node = node.parentElement;
    }
    return res;
  },
  bindScroll(ele, parent = window, cb) {
    let node = ele;
    while (parent.contains(node)) {
      node.addEventListener("scroll", cb);
      node = node.parentElement;
    }
    return () => {
      node = ele;
      while (parent.contains(node)) {
        node.removeEventListener("scroll", cb);
        node = node.parentElement;
      }
    };
  },
  getParentEle(ele, cb, container) {
    let node = ele;
    container = container || document.body;
    while (node && container.contains(node)) {
      if (cb(node)) {
        return node;
      } else {
        node = node.parentNode;
      }
    }
    return null;
  },
  getPathNode(node, path) {
    if (typeof path === "function") {
      return path(node);
    } else {
      let res = node;
      let pathList = path.split(".");
      for (let code of pathList) {
        if (res) {
          res = res[code];
        } else {
          break;
        }
      }
      return res;
    }
  },
  getSelectorEle(ele, selector) {
    if (ele) {
      if (typeof selector === "function") {
        return selector(ele);
      } else {
        return ele.querySelector(selector);
      }
    }
  },
  getSelectorEles(ele, selector, nodes, enableContains) {
    if (ele) {
      if (typeof selector === "function") {
        return selector(ele, nodes, enableContains);
      } else {
        // enableContains 是否允许嵌套的情况，防止使用selector时嵌套的父组件影响获取到同类子组件的情况，如form中嵌套chid_list或者child_form的情况
        let res = [...ele.querySelectorAll(selector)];
        if (!enableContains) {
          res = res.filter((i) => {
            return !res.some((j) => i !== j && j.contains(i));
          });
        }
        return res;
      }
    }
  }
};
export default util;
