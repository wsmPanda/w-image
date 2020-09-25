export default [
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
        showFileName: true
      },
      tree: {
        showEmptyFolder: false
      },
      mainLayout: {
        leftWidth: 100,
        rightWidth: 100,
        leftFold: false,
        rightFold: false,
        topFold: false
      }
    }
  },
  {
    name: "config_mode",
    init: []
  },
  {
    name: "setting",
    type: "object"
  },
  {
    name: "dictory",
    type: "array"
  },
  {
    name: "dictory_tree",
    type: "array"
  },

  {
    name: "storage",
    type: "object"
  },
  {
    name: "collect"
  }
];
