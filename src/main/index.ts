import { app, BrowserWindow, ipcMain, BrowserView } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow;
let webView: BrowserView;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    webView = new BrowserView();
    mainWindow.setBrowserView(webView);
    webView.setBounds({ x: 0, y: 50, width: 800, height: 550 });
    webView.webContents.loadURL('https://www.baidu.com');

    mainWindow.loadFile('src/renderer/index.html');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

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

ipcMain.on('navigate-to', (event, url) => {
    webView.webContents.loadURL(url);
});

ipcMain.on('go-back', () => {
    if (webView.webContents.canGoBack()) {
        webView.webContents.goBack();
    }
});
