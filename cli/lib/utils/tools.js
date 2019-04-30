const { execSync } = require('child_process');
const internalIp = require('internal-ip');


module.exports = {
  openBrowser: (url) => {
    execSync('ps cax | grep "Google Chrome"');
    execSync(
      `osascript chrome.applescript "${encodeURI(url)}"`,
      {
        cwd: __dirname,
        stdio: 'ignore',
      }
    );
  },

  localIP: () => internalIp.v4.sync(),
}