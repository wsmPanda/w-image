const fs = require('fs-extra');
const path = require('path');

<<<<<<< HEAD

=======
>>>>>>> e26f611... feat: 同步代码
const copyFiles = async () => {
  const sourcePath = path.resolve('./node_modules/@pdftron/webviewer/public');
  const destPath = path.resolve('./public/webviewer/');

  try {
    await fs.copy(sourcePath, destPath);
    console.log('WebViewer files copied over successfully');
  } catch (err) {
    console.error(err);
  }
};

copyFiles(); 