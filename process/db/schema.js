export default [
  // 界面配置表
  {
    name: "config",
    type: "object",
    init: {
      image: {
        padding: 4,
        margin: 4,
        column: 3,
        height: 80,
        preload: 3,
        showEmptyFolder: false,
        showFileName: true,
      },
      video: {},
      tree: {
        showEmptyFolder: false,
      },
      mainLayout: {
        leftWidth: 100,
        rightWidth: 100,
        leftFold: false,
        rightFold: false,
        topFold: false,
      },
    },
  },
  // 模式配置表
  {
    name: "config_mode",
    init: [],
  },
  {
    name: "setting",
    type: "object",
  },
  // 目录表
  {
    name: "dictory",
    type: "array",
  },
  // 缓存数据
  {
    name: "dictory_cache",
    type: "array",
  },
  // 目录结构缓存
  {
    name: "files_cache",
    type: "files",
  },
  // 目录树
  {
    name: "dictory_tree",
    type: "array",
  },
  // 状态缓存
  {
    name: "storage",
    type: "object",
  },
  // 收藏
  {
    name: "collect",
  },
  // 标签
  {
    name: "tag",
  },
  // 缓存数据
  {
    name: "cache",
  },
  // 图片状态记录
  {
    name: "images",
  },
  // 书签
  {
    name: "bookmark",
  },
  // 书签
  {
    name: "check_list",
  },
];
