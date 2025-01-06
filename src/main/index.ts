import { app, BaseWindow, WebContentsView, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, is } from '@electron-toolkit/utils'

let DEBUG = false

function createWindow() {
    electronApp.setAppUserModelId('com.stoneark')

    const win = new BaseWindow({
        width: 800,
        height: 600,
        //titleBarStyle: 'hidden',
        //titleBarOverlay: true
    })

    let w = win.getContentSize()[0];
    let d = win.getContentSize()[1];

    const bound = 0

    let topbar_h = 22+6+6+2
    let leftbar_w = 0
    let rightbar_w = DEBUG ? 700 : 0

    const parentView = new WebContentsView({
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
        }
    })
    win.contentView.addChildView(parentView)

    parentView.setBounds({ x: 0, y: 0, width: w, height: d })
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        parentView.webContents.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        parentView.webContents.loadFile(join(__dirname, '../renderer/index.html'))
    }

    const browserView = new WebContentsView()
    // enable browser touch zoom
    browserView.webContents.setVisualZoomLevelLimits(1, 3)
    win.contentView.addChildView(browserView)

    browserView.setBounds({
        x: leftbar_w+bound,
        y: topbar_h+bound,
        width: w-leftbar_w-rightbar_w-2*bound,
        height: d-topbar_h-2*bound
    })

    let navigate = (_,url) => parentView.webContents.send("navigate",url);

    let browser_home_page = 'https://baidu.com';
    //let browser_home_page = 'https://www.doubao.com/chat/search';

    DEBUG ? parentView.webContents.openDevTools() : null ;
    parentView.webContents.on('did-finish-load', () => {
        browserView.webContents.loadURL(browser_home_page);
        navigate(null,browser_home_page);
    });

    browserView.webContents.on('will-navigate', navigate);
    browserView.webContents.on('did-navigate', navigate);
    browserView.webContents.on('did-navigate-in-page', navigate);
    
    browserView.webContents.setWindowOpenHandler(({url}) => {
        // TODO 打开新tab
        browserView.webContents.loadURL(url);
        navigate(null,url);
        return {action: 'deny'};
    });

    ipcMain.on('browser-go',(_,url)=>{
        browserView.webContents.loadURL(url)
    });
    ipcMain.on('browser-back',()=>{
        if(browserView.webContents.canGoBack()) browserView.webContents.goBack()
    })
    ipcMain.on('browser-next',()=>{
        if(browserView.webContents.canGoForward()) browserView.webContents.goForward()
    })

    win.on('resize',() => {
        w = win.getContentSize()[0];
        d = win.getContentSize()[1];

        parentView.setBounds({ x: 0, y: 0, width: w, height: d })
        browserView.setBounds({
            x: leftbar_w+bound,
            y: topbar_h+bound,
            width: w-leftbar_w-rightbar_w-2*bound,
            height: d-topbar_h-2*bound
        })
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});

