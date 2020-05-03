const { app, BrowserWindow, autoUpdater, dialog } = require('electron');
const shell = require('electron').shell;
const fetch = require('node-fetch');
const client = require('discord-rich-presence')('705853390214791258');
const server = 'https://hazel-gilt.now.sh';
const feed = `${server}/update/${process.platform}/${app.getVersion()}`;

var time = Math.floor(Date.now() / 1000);

autoUpdater.setFeedURL(feed);

setInterval(() => {
  autoUpdater.checkForUpdates()
}, 60000)

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ["Restart", "Later"],
    title: 'Update Available!',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  }

  dialog.showMessageBox(dialogOpts, (response) => {
    if (response === 0) autoUpdater.quitAndInstall()
  })
})

autoUpdater.on('error', message => {
  console.error('There was a problem updating the application')
  console.error(message)
})

if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 700,
    height: 400,
    frame: false,
    transparent: true
  })

  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  mainWindow.webContents.on('new-window', function (e, url) {
    if ('file://' === url.substr(0, 'file://'.length)) {
      return;
    }
    e.preventDefault();
    shell.openExternal(url);
  });
};
app.on('ready', function () {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
const updateSong = async () => {
  try {
    let data = await (await fetch(`https://radio.risefm.net/api/nowplaying/1`)).json();
    let {
      now_playing: np
    } = data;
    let {
      song
    } = np;
    let {
      artist,
      title
    } = song;
    client.updatePresence({
      details: `Listening to RiseFM`,
      state: `${title} by ${artist}`,
      largeImageKey: 'icon',
      largeImageText: 'risefm.net',
      instance: true,
      startTimestamp: time
    });
  } catch (err) {
    console.error(err);
  };
};

updateSong();
setInterval(updateSong, 5000);