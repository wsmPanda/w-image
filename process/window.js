export default {
  width: 1000,
  height: 600,
  webPreferences: {
    // Use pluginOptions.nodeIntegration, leave this alone
    // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
    //nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
    nodeIntegration: true,
    webSecurity: false
  }
};
